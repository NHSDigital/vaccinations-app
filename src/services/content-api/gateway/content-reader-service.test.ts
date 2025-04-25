/**
 * @jest-environment node
 */

import { S3Client } from "@aws-sdk/client-s3";
import mockRsvVaccineJson from "@project/wiremock/__files/rsv-vaccine.json";
import mockSixInOneVaccineJson from "@project/wiremock/__files/6-in-1-vaccine.json";
import { VaccineTypes } from "@src/models/vaccine";
import {
  _readContentFromCache,
  getContentForVaccine,
} from "@src/services/content-api/gateway/content-reader-service";
import { configProvider } from "@src/utils/config";
import { Readable } from "stream";
import {
  ContentErrorTypes,
  GetContentForVaccineResponse,
} from "@src/services/content-api/types";

jest.mock("@aws-sdk/client-s3");
jest.mock("@src/utils/config");

describe("Content Reader Service", () => {
  describe("_readContentFromCache()", () => {
    const mockSend: jest.Mock = jest.fn();
    beforeEach(() => {
      (S3Client as jest.Mock).mockImplementation(() => ({
        send: mockSend,
      }));
    });

    it("returns content when object uri is local", async () => {
      const actual: string = await _readContentFromCache(
        "wiremock/__files",
        "/rsv-vaccine.json",
      );
      expect(JSON.parse(actual)).toStrictEqual(mockRsvVaccineJson);
    });

    it("returns content when object uri is remote", async () => {
      mockSend.mockImplementation(() => ({
        Body: new Readable({
          read() {
            this.push(JSON.stringify(mockRsvVaccineJson));
            this.push(null); // End of stream
          },
        }),
      }));

      const actual: string = await _readContentFromCache(
        "s3://bucket",
        "/file",
      );
      expect(JSON.parse(actual)).toStrictEqual(mockRsvVaccineJson);
    });

    it("throws when remote response is invalid", async () => {
      mockSend.mockImplementation(() => ({
        Body: {},
      }));

      const actualPromise: Promise<string> = _readContentFromCache(
        "s3://bucket",
        "/file",
      );
      await expect(actualPromise).rejects.toThrow("Unexpected response type");
    });

    it("throws when remote response has error", async () => {
      mockSend.mockImplementation(() => ({
        Body: new Readable({
          read() {
            this.emit("error", new Error("test error"));
          },
        }),
      }));

      const actualPromise: Promise<string> = _readContentFromCache(
        "s3://bucket",
        "/file",
      );
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

      it("should return response for 6-in-1 vaccine from content cache", async () => {
        const vaccine: VaccineTypes = VaccineTypes.SIX_IN_ONE;
        const {
          styledVaccineContent,
          contentError,
        }: GetContentForVaccineResponse = await getContentForVaccine(vaccine);

        expect(styledVaccineContent).toBeDefined();
        expect(styledVaccineContent?.overview).toEqual(
          mockSixInOneVaccineJson.mainEntityOfPage[0].text,
        );
        expect(styledVaccineContent?.whatVaccineIsFor?.heading).toEqual(
          mockSixInOneVaccineJson.mainEntityOfPage[1].headline,
        );
        expect(styledVaccineContent?.webpageLink).toEqual(
          mockSixInOneVaccineJson.webpage,
        );
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
        const { styledVaccineContent, contentError } =
          await getContentForVaccine(VaccineTypes.SIX_IN_ONE);

        expect(contentError).toEqual(ContentErrorTypes.CONTENT_LOADING_ERROR);
        expect(styledVaccineContent).toBeUndefined();
      });
    });
  });
});
