/**
 * @jest-environment node
 */

import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
  _writeContentToCache,
  _writeFileS3,
  writeContentForVaccine,
} from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { VaccineTypes } from "@src/models/vaccine";
import { configProvider } from "@src/utils/config";
import { writeFile } from "node:fs/promises";
import { vaccineTypeToPath } from "@src/services/content-api/constants";

jest.mock("@src/utils/config");
jest.mock("node:fs/promises");

let mockSend: jest.Mock = jest.fn();
jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(() => ({
      send: mockSend,
    })),
    PutObjectCommand: jest.fn(),
  };
});

describe("Content Writer Service", () => {
  const location: string = "test-location";
  const path: string = "/test-path";
  const content: string = "test-data";

  beforeEach(() => {
    mockSend = jest.fn();
  });

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

    it("should throw on error", async () => {
      const s3Error: string = "S3 error";
      mockSend = jest.fn().mockRejectedValue(new Error(s3Error));

      await expect(
        _writeFileS3("bad-bucket", "bad-key", "oops"),
      ).rejects.toThrow(s3Error);
    });
  });

  describe("_writeContentToCache()", () => {
    it("writes content locally when object uri is local", async () => {
      await _writeContentToCache(location, path, content);
      expect(writeFile).toHaveBeenCalledWith(`${location}${path}`, content);
    });

    it("writes content to S3 when object uri is remote", async () => {
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
      CONTENT_CACHE_PATH: location,
    }));

    it("should return response for 6-in-1 vaccine from content cache", async () => {
      const vaccine: VaccineTypes = VaccineTypes.SIX_IN_ONE;
      await writeContentForVaccine(vaccine, content);
      expect(writeFile).toHaveBeenCalledWith(
        `${location}${vaccineTypeToPath[vaccine]}.json`,
        content,
      );
    });
  });
});
