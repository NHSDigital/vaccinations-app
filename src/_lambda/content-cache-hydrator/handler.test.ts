import {
  ReadCachedContentResult,
  readCachedContentForVaccine,
} from "@src/_lambda/content-cache-hydrator/content-cache-reader";
import { vitaContentChangedSinceLastApproved } from "@src/_lambda/content-cache-hydrator/content-change-detector";
import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { handler } from "@src/_lambda/content-cache-hydrator/handler";
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
  });

  describe("when content-change-approval-needed feature enabled", () => {
    beforeEach(() => {
      (configProvider as jest.Mock).mockImplementation(() => ({
        CONTENT_CACHE_IS_CHANGE_APPROVAL_ENABLED: true,
      }));
    });

    it("saves new vaccine content and returns 200 when forceUpdate is true in inbound event and cached content was previously invalidated", async () => {
      (readCachedContentForVaccine as jest.Mock).mockResolvedValue(mockInvalidatedCacheReadResult);
      const fetchedContentForVaccine = "some-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(fetchedContentForVaccine);

      await expect(handler({ forceUpdate: true }, context)).resolves.toBeUndefined();

      Object.values(VaccineTypes).forEach((vaccineType) => {
        expect(writeContentForVaccine).toHaveBeenCalledWith(vaccineType, fetchedContentForVaccine);
      });
    });

    it("returns 200 when forceUpdate is not present in inbound event and cached content was previously invalidated", async () => {
      (readCachedContentForVaccine as jest.Mock).mockResolvedValue(mockInvalidatedCacheReadResult);
      const fetchedContentForVaccine = "some-content";
      (fetchContentForVaccine as jest.Mock).mockResolvedValue(fetchedContentForVaccine);

      await expect(handler({}, context)).resolves.toBeUndefined();

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

      expect(asyncLocalStorage.run).toHaveBeenCalledWith({ traceId: requestId }, expect.anything());
    });
  });
});
