/**
 * @jest-environment node
 */

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  _writeContentToCache,
  _writeFileS3,
  writeContentForVaccine,
} from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { VaccineTypes } from "@src/models/vaccine";
import configProvider from "@src/utils/config";
import { writeFile } from "node:fs/promises";
import { vaccineTypeToPath } from "@src/services/content-api/constants";

jest.mock("@src/utils/config");
let mockSend = jest.fn();
jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(() => ({
      send: mockSend,
    })),
    PutObjectCommand: jest.fn(),
  };
});

jest.mock("node:fs/promises");

describe("Content Writer Service", () => {
  const location: string = "test-location";
  const path: string = "/test-path";
  const content: string = "test-data";

  describe("_writeFileS3", () => {
    it("should send PutObjectCommand to S3", async () => {
      await _writeFileS3(location, path, content);

      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: location,
        Key: path,
        Body: content,
      });

      expect(mockSend).toHaveBeenCalled();
    });

    it("should throw and log on error", async () => {
      const s3Error = "S3 error";
      mockSend = jest.fn().mockRejectedValue(new Error(s3Error));

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(
        _writeFileS3("bad-bucket", "bad-key", "oops"),
      ).rejects.toThrow(s3Error);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error writing file to S3:"),
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("_writeContentToCache()", () => {
    const location: string = "test-location";
    const path: string = "/test-path";
    const content: string = "test-data";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("writes content locally when object uri is local", async () => {
      await _writeContentToCache(location, path, content);
      expect(writeFile).toHaveBeenCalledWith(`${location}${path}`, content);
    });

    it("writes content to S3 when object uri is remote", async () => {
      const mockSend = jest.fn();
      (S3Client as jest.Mock).mockImplementation(() => ({ send: mockSend }));

      await _writeContentToCache(`s3://${location}`, path, content);

      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: location,
        Key: path,
        Body: content,
      });
      expect(mockSend).toHaveBeenCalled();
    });
  });

  describe("writeContentForVaccine()", () => {
    (configProvider as jest.Mock).mockImplementation(() => ({
      CONTENT_CACHE_PATH: "test/path/",
    }));

    it("should return response for 6-in-1 vaccine from content cache", async () => {
      const vaccine = VaccineTypes.SIX_IN_ONE;
      await writeContentForVaccine(vaccine, "test-data");
      expect(writeFile).toHaveBeenCalledWith(
        `test/path/${vaccineTypeToPath[vaccine]}.json`,
        "test-data",
      );
    });
  });
});
