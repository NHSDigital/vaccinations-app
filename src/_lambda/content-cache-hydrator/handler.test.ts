import {
  ReadCachedContentResult,
  readCachedContentForVaccine,
} from "@src/_lambda/content-cache-hydrator/content-cache-reader";
import { vitaContentChangedSinceLastApproved } from "@src/_lambda/content-cache-hydrator/content-change-detector";
import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { _getConfigsThatThrowsOnColdStarts, handler } from "@src/_lambda/content-cache-hydrator/handler";
import { invalidateCacheForVaccine } from "@src/_lambda/content-cache-hydrator/invalidate-cache";
import { VaccineTypes } from "@src/models/vaccine";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import { configProvider } from "@src/utils/config";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { Context } from "aws-lambda";

jest.mock("@src/utils/config");
jest.mock("@src/_lambda/content-cache-hydrator/content-writer-service");
jest.mock("@src/_lambda/content-cache-hydrator/content-fetcher");
jest.mock("@src/_lambda/content-cache-hydrator/content-cache-reader");
jest.mock("@src/_lambda/content-cache-hydrator/content-change-detector");
jest.mock("@src/_lambda/content-cache-hydrator/invalidate-cache");
jest.mock("@src/services/content-api/parsers/content-filter-service");
jest.mock("@src/services/content-api/parsers/content-styling-service");

jest.mock("@src/utils/requestContext", () => ({
  asyncLocalStorage: {
    run: jest.fn().mockImplementation((request: RequestContext, callback) => callback()),
    disable: jest.fn(),
    getStore: jest.fn(),
    exit: jest.fn(),
    enterWith: jest.fn(),
    name: "name",
  },
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const mockValidCacheReadResult: ReadCachedContentResult = { cacheStatus: "valid", cacheContent: "some-content" };
const mockInvalidatedCacheReadResult: ReadCachedContentResult = { cacheStatus: "invalidated", cacheContent: "" };
const mockEmptyCacheReadResult: ReadCachedContentResult = { cacheStatus: "empty", cacheContent: "" };

describe("Lambda Handler", () => {
  const numberOfVaccines = Object.values(VaccineTypes).length;
  const context = {} as Context;

  beforeEach(() => {
    (fetchContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (getFilteredContentForVaccine as jest.Mock).mockReturnValue(undefined);
    (readCachedContentForVaccine as jest.Mock).mockResolvedValue(mockValidCacheReadResult);
    (vitaContentChangedSinceLastApproved as jest.Mock).mockReturnValue(false);
    (getStyledContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (writeContentForVaccine as jest.Mock).mockResolvedValue(undefined);
  });

  describe("when config provider is flaky on cold starts", () => {
    it("tries 3 times and throws when configProvider fails", async () => {
      (configProvider as jest.Mock).mockRejectedValue(undefined);

      await expect(_getConfigsThatThrowsOnColdStarts(0)).rejects.toThrow("Failed to get configs");

      expect(configProvider).toHaveBeenCalledTimes(3);
    });
    it("returns configs when configProvider succeeds", async () => {
      const testConfig = { test: "test" };
      (configProvider as jest.Mock).mockResolvedValue(testConfig);

      const configs = await _getConfigsThatThrowsOnColdStarts(0);
      expect(configs).toBe(testConfig);

      expect(configProvider).toHaveBeenCalledTimes(1);
    });
  });

  describe("when content-change-approval-needed feature disabled", () => {
    beforeEach(() => {
      (configProvider as jest.Mock).mockImplementation(() => ({
        CONTENT_CACHE_IS_CHANGE_APPROVAL_ENABLED: false,
      }));
    });

    it("saves new vaccine content when cache was empty", async () => {
      const fetchedContentForVaccine = "some-different-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(fetchedContentForVaccine);

      await expect(handler({}, context)).resolves.toBeUndefined();

      Object.values(VaccineTypes).forEach((vaccineType) => {
        expect(writeContentForVaccine).toHaveBeenCalledWith(vaccineType, fetchedContentForVaccine);
      });
    });

    it("saves new vaccine content when cache was previously invalidated", async () => {
      (readCachedContentForVaccine as jest.Mock).mockResolvedValue(mockInvalidatedCacheReadResult);
      const fetchedContentForVaccine = "some-different-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(fetchedContentForVaccine);
      (vitaContentChangedSinceLastApproved as jest.Mock).mockReturnValue(true);

      await expect(handler({}, context)).resolves.toBeUndefined();

      Object.values(VaccineTypes).forEach((vaccineType) => {
        expect(writeContentForVaccine).toHaveBeenCalledWith(vaccineType, fetchedContentForVaccine);
        expect(invalidateCacheForVaccine).not.toHaveBeenCalledWith(vaccineType);
      });
    });

    it("saves new vaccine content and does not invalidate cache if content has changed", async () => {
      const fetchedContentForVaccine = "some-content";

      (fetchContentForVaccine as jest.Mock).mockResolvedValue(fetchedContentForVaccine);
      (vitaContentChangedSinceLastApproved as jest.Mock).mockReturnValue(true);

      await expect(handler({}, context)).resolves.toBeUndefined();

      Object.values(VaccineTypes).forEach((vaccineType) => {
        expect(writeContentForVaccine).toHaveBeenCalledWith(vaccineType, fetchedContentForVaccine);
        expect(invalidateCacheForVaccine).not.toHaveBeenCalledWith(vaccineType);
      });
    });

    it("should only update one vaccine if vaccine name is set in inbound event", async () => {
      const vaccineToUpdate = "rsv";
      const fetchedContentForVaccine = "some-different-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(fetchedContentForVaccine);

      const event = { vaccineToUpdate: vaccineToUpdate };
      await expect(handler(event, context)).resolves.toBeUndefined();

      expect(writeContentForVaccine).toHaveBeenCalledTimes(1);
      expect(writeContentForVaccine).toHaveBeenCalledWith(VaccineTypes.RSV, fetchedContentForVaccine);
      expect(writeContentForVaccine).not.toHaveBeenCalledWith(VaccineTypes.RSV_PREGNANCY, fetchedContentForVaccine);
    });

    it("should throw if invalid vaccine name sent on inbound event", async () => {
      const vaccineToUpdate = "not-a-real-vaccine";
      const fetchedContentForVaccine = "some-different-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(fetchedContentForVaccine);

      const event = { vaccineToUpdate: vaccineToUpdate };

      await expect(handler(event, context)).rejects.toThrow(
        `Bad request: Vaccine name not recognised: ${vaccineToUpdate}`,
      );

      expect(writeContentForVaccine).toHaveBeenCalledTimes(0);
    });
  });

  describe("when content-change-approval-needed feature enabled", () => {
    beforeEach(() => {
      (configProvider as jest.Mock).mockImplementation(() => ({
        CONTENT_CACHE_IS_CHANGE_APPROVAL_ENABLED: true,
      }));
    });

    it("overwrites invalidated cache with new updated content when forceUpdate is true in inbound event", async () => {
      (readCachedContentForVaccine as jest.Mock).mockResolvedValue(mockInvalidatedCacheReadResult);
      const newContentFromContentAPI = "new-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(newContentFromContentAPI);

      const event = { forceUpdate: true };
      await expect(handler(event, context)).resolves.toBeUndefined();

      Object.values(VaccineTypes).forEach((vaccineType) => {
        expect(writeContentForVaccine).toHaveBeenCalledWith(vaccineType, newContentFromContentAPI);
      });
    });

    it("does not overwrite invalidated cache with new content when forceUpdate is false in inbound event", async () => {
      (readCachedContentForVaccine as jest.Mock).mockResolvedValue(mockInvalidatedCacheReadResult);
      const newContentFromContentAPI = "new-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(newContentFromContentAPI);

      const event = { forceUpdate: false };
      await expect(handler(event, context)).resolves.toBeUndefined();

      expect(writeContentForVaccine).not.toHaveBeenCalled();
    });

    it("does not overwrite invalidated cache with new content when forceUpdate is not present in inbound event", async () => {
      (readCachedContentForVaccine as jest.Mock).mockResolvedValue(mockInvalidatedCacheReadResult);
      const newContentFromContentAPI = "new-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(newContentFromContentAPI);

      const event = {};
      await expect(handler(event, context)).resolves.toBeUndefined();

      expect(writeContentForVaccine).not.toHaveBeenCalled();
    });

    it("returns 200 when cache hydration is successful", async () => {
      (vitaContentChangedSinceLastApproved as jest.Mock).mockReturnValue(false);

      await expect(handler({}, context)).resolves.toBeUndefined();
    });

    it("saves new vaccine content when cache was empty", async () => {
      (readCachedContentForVaccine as jest.Mock).mockResolvedValue(mockEmptyCacheReadResult);

      const fetchedContentForVaccine = "some-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(fetchedContentForVaccine);

      await expect(handler({}, context)).resolves.toBeUndefined();

      Object.values(VaccineTypes).forEach((vaccineType) => {
        expect(writeContentForVaccine).toHaveBeenCalledWith(vaccineType, fetchedContentForVaccine);
      });
    });

    it("returns 200 and invalidates cache when content changes detected", async () => {
      (vitaContentChangedSinceLastApproved as jest.Mock).mockReturnValue(true);

      await expect(handler({}, context)).resolves.toBeUndefined();

      Object.values(VaccineTypes).forEach((vaccineType) => {
        expect(invalidateCacheForVaccine).toHaveBeenCalledWith(vaccineType);
      });

      expect(writeContentForVaccine).not.toHaveBeenCalled();
    });

    it("returns 200 when cached content had already been invalidated", async () => {
      (readCachedContentForVaccine as jest.Mock).mockResolvedValue(mockInvalidatedCacheReadResult);

      await expect(handler({}, context)).resolves.toBeUndefined();

      expect(writeContentForVaccine).not.toHaveBeenCalled();
    });

    it("returns 500 when cache hydration has failed due to fetching errors", async () => {
      (fetchContentForVaccine as jest.Mock).mockRejectedValue(new Error("test"));

      await expect(handler({}, context)).rejects.toThrow(`${numberOfVaccines} failures`);
    });

    it("returns 500 when cache hydration has failed due to filtering invalid content errors", async () => {
      (getFilteredContentForVaccine as jest.Mock).mockImplementation(() => {
        throw new Error("test");
      });

      await expect(handler({}, context)).rejects.toThrow(`${numberOfVaccines} failures`);
    });

    it("returns 500 when cache hydration has failed due to styling errors", async () => {
      (getStyledContentForVaccine as jest.Mock).mockRejectedValue(new Error("test"));

      await expect(handler({}, context)).rejects.toThrow(`${numberOfVaccines} failures`);
    });

    it("returns 500 when cache hydration has failed due to writing errors", async () => {
      (writeContentForVaccine as jest.Mock).mockRejectedValue(new Error("test"));

      await expect(handler({}, context)).rejects.toThrow(`${numberOfVaccines} failures`);
    });

    it("stores requestID as traceid in asyncLocalStorage context", async () => {
      const requestId = "mock-request-id";
      const contextWithRequestId = { awsRequestId: requestId } as Context;

      await handler({}, contextWithRequestId);

      expect(asyncLocalStorage.run).toHaveBeenCalledWith({ traceId: requestId, nextUrl: "" }, expect.anything());
    });

    it("should only update one vaccine if vaccine name is set in inbound event", async () => {
      const vaccineToUpdate = "rsv";
      const fetchedContentForVaccine = "some-different-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(fetchedContentForVaccine);

      const event = { vaccineToUpdate: vaccineToUpdate };
      await expect(handler(event, context)).resolves.toBeUndefined();

      expect(writeContentForVaccine).toHaveBeenCalledTimes(1);
      expect(writeContentForVaccine).toHaveBeenCalledWith(VaccineTypes.RSV, fetchedContentForVaccine);
      expect(writeContentForVaccine).not.toHaveBeenCalledWith(VaccineTypes.RSV_PREGNANCY, fetchedContentForVaccine);
    });
  });
});
