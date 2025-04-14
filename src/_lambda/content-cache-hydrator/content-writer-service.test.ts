/**
 * @jest-environment node
 */

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  _writeContentToCache,
  writeContentForVaccine,
} from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { VaccineTypes } from "@src/models/vaccine";
import configProvider from "@src/utils/config";
import { writeFile } from "node:fs/promises";
import { Readable } from "stream";

jest.mock("@aws-sdk/client-s3");
jest.mock("node:fs/promises");
jest.mock("@src/utils/config");

describe("Content Writer Service", () => {
  const location = "test-location";
  const path = "/test-path";
  const content = "test-data";

  describe("_writeContentToCache()", () => {
    const mockSend = jest.fn();
    beforeEach(() => {
      (S3Client as jest.Mock).mockImplementation(() => ({
        send: mockSend,
      }));
    });

    it("writes content when object uri is local", async () => {
      await _writeContentToCache(location, path, content);
      expect(writeFile).toHaveBeenCalledWith(`${location}${path}`, content);
    });

    it("writes content when object uri is remote", async () => {
      await _writeContentToCache(`s3://${location}`, path, content);
      expect(mockSend).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      // expect(_writeFileS3).toHaveBeenCalledWith("test_location", "/test_path", "test_content");
    });

    it("throws when remote response is invalid", async () => {
      mockSend.mockImplementation(() => ({
        Body: {},
      }));

      await _writeContentToCache(`s3://${location}`, path, content);
      // TODO: expect
    });

    it("throws when remote response has error", async () => {
      mockSend.mockImplementation(() => ({
        Body: new Readable({
          read() {
            this.emit("error", new Error("test error"));
          },
        }),
      }));

      await _writeContentToCache(`s3://${location}`, path, content);
      // TODO: expect
    });
  });

  describe("writeContentForVaccine()", () => {
    (configProvider as jest.Mock).mockImplementation(() => ({
      CONTENT_CACHE_PATH: "wiremock/__files/",
    }));

    it("should return response for 6-in-1 vaccine from content cache", async () => {
      const vaccine = VaccineTypes.SIX_IN_ONE;
      await writeContentForVaccine(vaccine, content);
      // TODO: expect
    });
  });
});
