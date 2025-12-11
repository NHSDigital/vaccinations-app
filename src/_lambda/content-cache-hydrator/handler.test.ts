import {
  ReadCachedContentResult,
  readCachedContentForVaccine,
} from "@src/_lambda/content-cache-hydrator/content-cache-reader";
import { vitaContentChangedSinceLastApproved } from "@src/_lambda/content-cache-hydrator/content-change-detector";
import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { handler } from "@src/_lambda/content-cache-hydrator/handler";
import { invalidateCacheForVaccine } from "@src/_lambda/content-cache-hydrator/invalidate-cache";
import { VaccineType } from "@src/models/vaccine";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import config from "@src/utils/config";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { Context } from "aws-lambda";

jest.mock("@src/_lambda/content-cache-hydrator/content-writer-service");
jest.mock("@src/_lambda/content-cache-hydrator/content-fetcher");
jest.mock("@src/_lambda/content-cache-hydrator/content-cache-reader");
jest.mock("@src/_lambda/content-cache-hydrator/content-change-detector");
jest.mock("@src/_lambda/content-cache-hydrator/invalidate-cache");
jest.mock("@src/services/content-api/parsers/content-filter-service");
jest.mock("@src/services/content-api/parsers/content-styling-service");
jest.mock("@src/services/nbs/nbs-service", () => ({}));

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
const mockMarkdownWithStylingHtml = "<ul><li>sausage</li><li>egg</li><li>chips</li></ul>";
jest.mock("@project/src/app/_components/markdown/MarkdownWithStyling", () => ({
  MarkdownWithStyling: () => mockMarkdownWithStylingHtml,
}));
jest.mock("cheerio", () => ({
  load: jest.fn(() => {
    const selectorImpl = jest.fn(() => ({
      attr: jest.fn(),
    }));

    const $ = Object.assign(selectorImpl, {
      html: jest.fn(() => "<p>HTML fragment</p>"),
    });

    return $;
  }),
}));

const mockValidCacheReadResult: ReadCachedContentResult = { cacheStatus: "valid", cacheContent: "some-content" };
const mockInvalidatedCacheReadResult: ReadCachedContentResult = { cacheStatus: "invalidated", cacheContent: "" };
const mockEmptyCacheReadResult: ReadCachedContentResult = { cacheStatus: "empty", cacheContent: "" };

describe("Lambda Handler", () => {
  const numberOfVaccines = Object.values(VaccineType).length;
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
    const mockedConfig = config as ConfigMock;

    beforeEach(() => {
      const defaultConfig = configBuilder().withContentCacheIsChangeApprovalEnabled(false).build();
      Object.assign(mockedConfig, defaultConfig);
    });

    it("saves new vaccine content when cache was empty", async () => {
      const fetchedContentForVaccine = "some-different-content";
      mockFetchContentForVaccineWith(fetchedContentForVaccine);

      await expectHandlerToResolveSuccessfullyWithUndefinedResponse({}, context);

      expectWriteContentToHaveBeenCalledForAllVaccinesWithFetchedContent(fetchedContentForVaccine);
    });

    it("saves new vaccine content when cache was previously invalidated", async () => {
      mockReadCachedContentForVaccineWith(mockInvalidatedCacheReadResult);
      const fetchedContentForVaccine = "some-different-content";
      await expectWhenContentFetchReturnsToSaveNewContentAndDoNotInvalidateCache(fetchedContentForVaccine);
    });

    it("saves new vaccine content and does not invalidate cache if content has changed", async () => {
      const fetchedContentForVaccine = "some-content";
      await expectWhenContentFetchReturnsToSaveNewContentAndDoNotInvalidateCache(fetchedContentForVaccine);
    });

    it("should only update one vaccine if vaccine name is set in inbound event", async () => {
      await expectUpdateOnlyOneVaccineIfNameSetOnInboundEvent();
    });

    it("should throw if invalid vaccine name sent on inbound event", async () => {
      const vaccineToUpdate = "not-a-real-vaccine";
      const fetchedContentForVaccine = "some-different-content";
      mockFetchContentForVaccineWith(fetchedContentForVaccine);

      const event = { vaccineToUpdate: vaccineToUpdate };

      await expect(handler(event, context)).rejects.toThrow(
        `Bad request: Vaccine name not recognised: ${vaccineToUpdate}`,
      );

      expect(writeContentForVaccine).toHaveBeenCalledTimes(0);
    });
  });

  describe("when content-change-approval-needed feature enabled", () => {
    const mockedConfig = config as ConfigMock;

    beforeEach(() => {
      const defaultConfig = configBuilder().withContentCacheIsChangeApprovalEnabled(true).build();
      Object.assign(mockedConfig, defaultConfig);
    });

    it("overwrites invalidated cache with new updated content when forceUpdate is true in inbound event", async () => {
      mockReadCachedContentForVaccineWith(mockInvalidatedCacheReadResult);
      const newContentFromContentAPI = "new-content";
      mockFetchContentForVaccineWith(newContentFromContentAPI);

      const event = { forceUpdate: true };
      await expectHandlerToResolveSuccessfullyWithUndefinedResponse(event, context);

      Object.values(VaccineType).forEach((vaccineType) => {
        expect(writeContentForVaccine).toHaveBeenCalledWith(vaccineType, newContentFromContentAPI);
      });
    });

    it("does not overwrite invalidated cache with new content when forceUpdate is false in inbound event", async () => {
      mockReadCachedContentForVaccineWith(mockInvalidatedCacheReadResult);
      const newContentFromContentAPI = "new-content";
      mockFetchContentForVaccineWith(newContentFromContentAPI);

      const event = { forceUpdate: false };
      await expectHandlerToResolveSuccessfullyWithUndefinedResponse(event, context);

      expect(writeContentForVaccine).not.toHaveBeenCalled();
    });

    it("does not overwrite invalidated cache with new content when forceUpdate is not present in inbound event", async () => {
      mockReadCachedContentForVaccineWith(mockInvalidatedCacheReadResult);
      const newContentFromContentAPI = "new-content";
      mockFetchContentForVaccineWith(newContentFromContentAPI);

      await expectHandlerToResolveSuccessfullyWithUndefinedResponse({}, context);

      expect(writeContentForVaccine).not.toHaveBeenCalled();
    });

    it("returns 200 when cache hydration is successful", async () => {
      (vitaContentChangedSinceLastApproved as jest.Mock).mockReturnValue(false);

      await expectHandlerToResolveSuccessfullyWithUndefinedResponse({}, context);
    });

    it("saves new vaccine content when cache was empty", async () => {
      mockReadCachedContentForVaccineWith(mockEmptyCacheReadResult);
      const fetchedContentForVaccine = "some-content";
      mockFetchContentForVaccineWith(fetchedContentForVaccine);

      await expectHandlerToResolveSuccessfullyWithUndefinedResponse({}, context);

      expectWriteContentToHaveBeenCalledForAllVaccinesWithFetchedContent(fetchedContentForVaccine);
    });

    it("returns 200 and invalidates cache when content changes detected", async () => {
      (vitaContentChangedSinceLastApproved as jest.Mock).mockReturnValue(true);

      await expectHandlerToResolveSuccessfullyWithUndefinedResponse({}, context);

      Object.values(VaccineType).forEach((vaccineType) => {
        expect(invalidateCacheForVaccine).toHaveBeenCalledWith(vaccineType);
      });

      expect(writeContentForVaccine).not.toHaveBeenCalled();
    });

    it("returns 200 when cached content had already been invalidated", async () => {
      mockReadCachedContentForVaccineWith(mockInvalidatedCacheReadResult);

      await expect(handler({}, context)).resolves.toBeUndefined();

      expect(writeContentForVaccine).not.toHaveBeenCalled();
    });

    it("returns 500 when cache hydration has failed due to fetching errors", async () => {
      (fetchContentForVaccine as jest.Mock).mockRejectedValue(new Error("test"));

      await expectHydrationToThrowFailureForAllVaccines();
    });

    it("returns 500 when cache hydration has failed due to filtering invalid content errors", async () => {
      (getFilteredContentForVaccine as jest.Mock).mockImplementation(() => {
        throw new Error("test");
      });

      await expectHydrationToThrowFailureForAllVaccines();
    });

    it("returns 500 when cache hydration has failed due to styling errors", async () => {
      (getStyledContentForVaccine as jest.Mock).mockRejectedValue(new Error("test"));

      await expectHydrationToThrowFailureForAllVaccines();
    });

    it("returns 500 when cache hydration has failed due to writing errors", async () => {
      (writeContentForVaccine as jest.Mock).mockRejectedValue(new Error("test"));

      await expectHydrationToThrowFailureForAllVaccines();
    });

    it("stores requestID as traceid in asyncLocalStorage context", async () => {
      const requestId = "mock-request-id";
      const contextWithRequestId = { awsRequestId: requestId } as Context;

      await handler({}, contextWithRequestId);

      expect(asyncLocalStorage.run).toHaveBeenCalledWith({ traceId: requestId, nextUrl: "" }, expect.anything());
    });

    it("should only update one vaccine if vaccine name is set in inbound event", async () => {
      await expectUpdateOnlyOneVaccineIfNameSetOnInboundEvent();
    });
  });

  const mockReadCachedContentForVaccineWith = (mockInvalidatedCacheReadResult: ReadCachedContentResult) => {
    (readCachedContentForVaccine as jest.Mock).mockResolvedValue(mockInvalidatedCacheReadResult);
  };

  const mockFetchContentForVaccineWith = (fetchContentResult: string) => {
    (fetchContentForVaccine as jest.Mock).mockResolvedValue(fetchContentResult);
  };

  const expectUpdateOnlyOneVaccineIfNameSetOnInboundEvent = async () => {
    const vaccineToUpdate = "rsv";
    const fetchedContentForVaccine = "some-different-content";
    mockFetchContentForVaccineWith(fetchedContentForVaccine);

    const event = { vaccineToUpdate: vaccineToUpdate };
    await expect(handler(event, context)).resolves.toBeUndefined();

    expect(writeContentForVaccine).toHaveBeenCalledTimes(1);
    expect(writeContentForVaccine).toHaveBeenCalledWith(VaccineType.RSV, fetchedContentForVaccine);
    expect(writeContentForVaccine).not.toHaveBeenCalledWith(VaccineType.RSV_PREGNANCY, fetchedContentForVaccine);
  };

  const expectHydrationToThrowFailureForAllVaccines = async () => {
    await expect(handler({}, context)).rejects.toThrow(`${numberOfVaccines} failures`);
  };

  const expectWhenContentFetchReturnsToSaveNewContentAndDoNotInvalidateCache = async (
    fetchedContentForVaccine: string,
  ) => {
    mockFetchContentForVaccineWith(fetchedContentForVaccine);
    (vitaContentChangedSinceLastApproved as jest.Mock).mockReturnValue(true);

    await expectHandlerToResolveSuccessfullyWithUndefinedResponse({}, context);

    Object.values(VaccineType).forEach((vaccineType) => {
      expect(writeContentForVaccine).toHaveBeenCalledWith(vaccineType, fetchedContentForVaccine);
      expect(invalidateCacheForVaccine).not.toHaveBeenCalledWith(vaccineType);
    });
  };

  const expectHandlerToResolveSuccessfullyWithUndefinedResponse = async (
    lambdaTriggerEvent: object,
    context: Context,
  ) => {
    await expect(handler(lambdaTriggerEvent, context)).resolves.toBeUndefined();
  };

  const expectWriteContentToHaveBeenCalledForAllVaccinesWithFetchedContent = (fetchedContentForVaccine: string) => {
    Object.values(VaccineType).forEach((vaccineType) => {
      expect(writeContentForVaccine).toHaveBeenCalledWith(vaccineType, fetchedContentForVaccine);
    });
  };
});
