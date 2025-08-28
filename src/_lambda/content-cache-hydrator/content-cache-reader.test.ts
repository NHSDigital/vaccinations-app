import {
  ReadCachedContentResult,
  readCachedContentForVaccine,
} from "@src/_lambda/content-cache-hydrator/content-cache-reader";
import { VaccineTypes } from "@src/models/vaccine";
import { vaccineTypeToPath } from "@src/services/content-api/constants";
import { readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import { InvalidatedCacheError, S3NoSuchKeyError } from "@src/services/content-api/gateway/exceptions";
import { AppConfig, configProvider } from "@src/utils/config";

jest.mock("@src/utils/config");
jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const mockContentCachePath = "wiremock/__files/";

describe("readCachedContentForVaccine", () => {
  const mockCacheFileContents = "mock-cache-file-contents";
  const vaccineType = VaccineTypes.RSV;

  beforeEach(() => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        CONTENT_CACHE_PATH: mockContentCachePath,
      }),
    );
    (readContentFromCache as jest.Mock).mockImplementation((): string => mockCacheFileContents);
  });

  it("should read content for named vaccine from cache", async () => {
    const { cacheStatus, cacheContent }: ReadCachedContentResult = await readCachedContentForVaccine(vaccineType);

    expect(readContentFromCache).toHaveBeenCalledWith(mockContentCachePath, `${vaccineTypeToPath[vaccineType]}.json`);
    expect(cacheContent).toBe(mockCacheFileContents);
    expect(cacheStatus).toBe("valid");
  });

  it("should return invalid cache result status if cache was previously invalidated", async () => {
    const readContentFromCacheError = new InvalidatedCacheError("invalid cache result");
    (readContentFromCache as jest.Mock).mockRejectedValue(readContentFromCacheError);

    const { cacheStatus, cacheContent }: ReadCachedContentResult = await readCachedContentForVaccine(vaccineType);

    expect(cacheContent).toBe("");
    expect(cacheStatus).toBe("invalidated");
  });

  it("should return empty cache result status if cache was not present", async () => {
    const readContentFromCacheError = new S3NoSuchKeyError("no such key");
    (readContentFromCache as jest.Mock).mockRejectedValue(readContentFromCacheError);

    const { cacheStatus, cacheContent }: ReadCachedContentResult = await readCachedContentForVaccine(vaccineType);

    expect(cacheContent).toBe("");
    expect(cacheStatus).toBe("empty");
  });

  it("should throw if readContentFromCache throws unhandled error", async () => {
    const readContentFromCacheError = new Error("test");
    (readContentFromCache as jest.Mock).mockRejectedValue(readContentFromCacheError);
    await expect(readCachedContentForVaccine(vaccineType)).rejects.toThrow(readContentFromCacheError);
  });
});
