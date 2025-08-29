/**
 * @jest-environment node
 */
import { S3Client } from "@aws-sdk/client-s3";
import mockRsvVaccineJson from "@project/wiremock/__files/rsv-vaccine.json";
import { VaccineTypes } from "@src/models/vaccine";
import { INVALIDATED_CONTENT_OVERWRITE_VALUE } from "@src/services/content-api/constants";
import { readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import { Readable } from "stream";

jest.mock("@aws-sdk/client-s3");
jest.mock("@src/utils/config");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const mockRsvResponse = {
  Body: new Readable({
    read() {
      this.push(JSON.stringify(mockRsvVaccineJson));
      this.push(null); // End of stream
    },
  }),
};

const mockInvalidResponse = {
  Body: {},
};

const mockErrorResponse = {
  Body: new Readable({
    read() {
      this.emit("error", new Error("test error"));
    },
  }),
};

describe("Content Reader Service", () => {
  describe("readContentFromCache()", () => {
    const mockSend: jest.Mock = jest.fn();
    const vaccineType = VaccineTypes.RSV;

    beforeEach(() => {
      (S3Client as jest.Mock).mockImplementation(() => ({
        send: mockSend,
      }));
    });

    it("returns content when object uri is local", async () => {
      const actual: string = await readContentFromCache("wiremock/__files", "/rsv-vaccine.json", vaccineType);
      expect(JSON.parse(actual)).toStrictEqual(mockRsvVaccineJson);
    });

    it("returns content when object uri is remote", async () => {
      mockSend.mockImplementation(() => mockRsvResponse);

      const actual: string = await readContentFromCache("s3://bucket", "/file", vaccineType);
      expect(JSON.parse(actual)).toStrictEqual(mockRsvVaccineJson);
    });

    it("throws when remote response is invalid", async () => {
      mockSend.mockImplementation(() => mockInvalidResponse);

      const actualPromise: Promise<string> = readContentFromCache("s3://bucket", "/file", vaccineType);
      await expect(actualPromise).rejects.toThrow("Error fetching content: unexpected response type");
    });

    it("throws when remote response has error", async () => {
      mockSend.mockImplementation(() => mockErrorResponse);

      const actualPromise: Promise<string> = readContentFromCache("s3://bucket", "/file", vaccineType);
      await expect(actualPromise).rejects.toThrow("test error");
    });

    it("throws if contents of cache have been invalidated while awaiting approval of changes from clinical", async () => {
      const actualPromise = readContentFromCache("wiremock/__files", "/invalidated-cache.json", vaccineType);

      await expect(actualPromise).rejects.toThrow(
        `Unable to load content from cache: ${INVALIDATED_CONTENT_OVERWRITE_VALUE}`,
      );
    });
  });
});
