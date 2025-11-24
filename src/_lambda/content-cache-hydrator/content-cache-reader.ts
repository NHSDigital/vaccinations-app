import { Filename, VaccineInfo, VaccineType } from "@src/models/vaccine";
import { readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import { InvalidatedCacheError, S3NoSuchKeyError } from "@src/services/content-api/gateway/exceptions";
import config from "@src/utils/config";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "content-cache-reader" });

export interface ReadCachedContentResult {
  cacheStatus: "empty" | "valid" | "invalidated";
  cacheContent: string;
}

const readCachedContentForVaccine = async (vaccineType: VaccineType): Promise<ReadCachedContentResult> => {
  const cacheFilename: Filename = VaccineInfo[vaccineType].cacheFilename;
  let cachedContent: string;

  try {
    cachedContent = await readContentFromCache(await config.CONTENT_CACHE_PATH, cacheFilename, vaccineType);
  } catch (error) {
    if (error instanceof S3NoSuchKeyError) {
      return { cacheStatus: "empty", cacheContent: "" };
    } else if (error instanceof InvalidatedCacheError) {
      return { cacheStatus: "invalidated", cacheContent: "" };
    } else {
      log.error({ error: error, context: { vaccineType } }, "Unexpected error occurred.");
      throw error;
    }
  }

  return { cacheStatus: "valid", cacheContent: cachedContent };
};

export { readCachedContentForVaccine };
