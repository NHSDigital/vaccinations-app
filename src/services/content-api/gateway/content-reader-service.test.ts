/**
 * @jest-environment node
 */

import { S3Client } from "@aws-sdk/client-s3";
import mockRsvVaccineJson from "@project/wiremock/__files/rsv-vaccine.json";
import { VaccineTypes } from "@src/models/vaccine";
import {
  _readContentFromCache,
  _readFileS3,
  getContentForVaccine,
} from "@src/services/content-api/gateway/content-reader-service";
import { configProvider } from "@src/utils/config";
import { Readable } from "stream";
import { ContentErrorTypes, GetContentForVaccineResponse } from "@src/services/content-api/types";
import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { handler } from "@src/_lambda/content-cache-hydrator/handler";

jest.mock("@aws-sdk/client-s3");
jest.mock("@src/utils/config");

const mockRsvResponse = {
  Body: new Readable({
    read() {
      this.push(JSON.stringify(mockRsvVaccineJson));
      this.push(null); // End of stream
    },
  }),
};

const NoSuchKeyHttpStatusError = {
  name: "NoSuchKey",
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
  describe("_readFileS3", () => {
    const mockSend: jest.Mock = jest.fn();

    beforeEach(() => {
      (S3Client as jest.Mock).mockImplementation(() => ({
        send: mockSend,
      }));
    });

    it("throws NoSuchKeyHttpStatusError when the file and bucket don't exist", async () => {
      (mockSend as jest.Mock).mockRejectedValue(NoSuchKeyHttpStatusError);

      const error = await _readFileS3("s3://bucket", "/file");
      expect(error).toThrow(`Error adf in reading Content API from S3`);
    });
  });

  describe("_readContentFromCache()", () => {
    const mockSend: jest.Mock = jest.fn();

    beforeEach(() => {
      (S3Client as jest.Mock).mockImplementation(() => ({
        send: mockSend,
      }));
    });

    it("returns content when object uri is local", async () => {
      const actual: string = await _readContentFromCache("wiremock/__files", "/rsv-vaccine.json");
      expect(JSON.parse(actual)).toStrictEqual(mockRsvVaccineJson);
    });

    it("returns content when object uri is remote", async () => {
      mockSend.mockImplementation(() => mockRsvResponse);

      const actual: string = await _readContentFromCache("s3://bucket", "/file");
      expect(JSON.parse(actual)).toStrictEqual(mockRsvVaccineJson);
    });

    it("throws when remote response is invalid", async () => {
      mockSend.mockImplementation(() => mockInvalidResponse);

      const actualPromise: Promise<string> = _readContentFromCache("s3://bucket", "/file");
      await expect(actualPromise).rejects.toThrow("Unexpected response type");
    });

    it("throws when remote response has error", async () => {
      mockSend.mockImplementation(() => mockErrorResponse);

      const actualPromise: Promise<string> = _readContentFromCache("s3://bucket", "/file");
      await expect(actualPromise).rejects.toThrow("test error");
    });
  });

  describe("getContentForVaccine()", () => {
    describe("when readContent succeeds", () => {
      beforeEach(() => {
        (configProvider as jest.Mock).mockImplementation(() => ({
          CONTENT_CACHE_PATH: "wiremock/__files/",
        }));
      });

      it("should return response for rsv vaccine from content cache", async () => {
        const vaccine: VaccineTypes = VaccineTypes.RSV;
        const { styledVaccineContent, contentError }: GetContentForVaccineResponse =
          await getContentForVaccine(vaccine);

        expect(styledVaccineContent).toBeDefined();
        expect(styledVaccineContent?.overview).toEqual(mockRsvVaccineJson.mainEntityOfPage[0].text);
        expect(styledVaccineContent?.whatVaccineIsFor?.heading).toEqual(
          mockRsvVaccineJson.mainEntityOfPage[1].headline,
        );
        expect(styledVaccineContent?.webpageLink).toEqual(mockRsvVaccineJson.webpage);
        expect(contentError).toBeUndefined();
      });
    });

    describe("when readContent fails", () => {
      beforeEach(() => {
        (configProvider as jest.Mock).mockImplementation(() => ({
          CONTENT_CACHE_PATH: "wiremock/path-does-not-exist/",
        }));
      });

      it("should return error if content read fails", async () => {
        const { styledVaccineContent, contentError } = await getContentForVaccine(VaccineTypes.RSV);

        expect(contentError).toEqual(ContentErrorTypes.CONTENT_LOADING_ERROR);
        expect(styledVaccineContent).toBeUndefined();
      });
    });
  });
});
