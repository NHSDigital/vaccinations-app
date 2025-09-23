import { VaccineTypes } from "@src/models/vaccine";
import { VaccineContentPaths, vaccineTypeToPath } from "@src/services/content-api/constants";
import { readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import { InvalidatedCacheError, S3NoSuchKeyError } from "@src/services/content-api/gateway/exceptions";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "content-cache-reader" });

export interface ReadCachedContentResult {
  cacheStatus: "empty" | "valid" | "invalidated";
  cacheContent: string;
}

const readCachedContentForVaccine = async (vaccineType: VaccineTypes): Promise<ReadCachedContentResult> => {
  const config: AppConfig = await configProvider();
  const vaccineContentPath: VaccineContentPaths = vaccineTypeToPath[vaccineType];
  let cachedContent: string;

  try {
    cachedContent = await readContentFromCache(config.CONTENT_CACHE_PATH, `${vaccineContentPath}.json`, vaccineType);
  } catch (error) {
    if (error instanceof S3NoSuchKeyError) {
      return { cacheStatus: "empty", cacheContent: "" };
    } else if (error instanceof InvalidatedCacheError) {
      return { cacheStatus: "invalidated", cacheContent: "" };
    } else {
      log.error({ error }, "Unexpected error occurred.");
      throw error;
    }
  }

  return { cacheStatus: "valid", cacheContent: cachedContent };
};

export { readCachedContentForVaccine };
