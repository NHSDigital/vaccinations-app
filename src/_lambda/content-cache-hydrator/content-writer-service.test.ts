/**
 * @jest-environment node
 */
import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
  _writeContentToCache,
  _writeFileS3,
  writeContentForVaccine,
} from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { Filename, VaccineInfo, VaccineType } from "@src/models/vaccine";
import lazyConfig from "@src/utils/lazy-config";
import { AsyncConfigMock, lazyConfigBuilder } from "@test-data/config/builders";
import { writeFile } from "node:fs/promises";

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
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("Content Writer Service", () => {
  const location: string = "test-location/";
  const path: Filename = "test-filename.json" as Filename;
  const content: string = "test-data";
  const mockedConfig = lazyConfig as AsyncConfigMock;

  beforeEach(() => {
    mockSend = jest.fn();
    const defaultConfig = lazyConfigBuilder().withContentCachePath(location).build();
    Object.assign(mockedConfig, defaultConfig);
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

      await expect(_writeFileS3("bad-bucket", "bad-key", "oops")).rejects.toThrow(s3Error);
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
    it("should return response for rsv vaccine from content cache", async () => {
      const vaccine: VaccineType = VaccineType.RSV;
      await writeContentForVaccine(vaccine, content);
      expect(writeFile).toHaveBeenCalledWith(`${location}${VaccineInfo[VaccineType.RSV].cacheFilename}`, content);
    });
  });
});
