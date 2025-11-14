import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import { InvalidatedCacheError, ReadingS3Error } from "@src/services/content-api/gateway/exceptions";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import {
  ContentErrorTypes,
  GetContentForVaccineResponse,
  StyledVaccineContent,
  VaccinePageContent,
} from "@src/services/content-api/types";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "content-service" });

const GetVaccineContentPerformanceMarker = "get-vaccine-content";

const getContentForVaccine = async (vaccineType: VaccineTypes): Promise<GetContentForVaccineResponse> => {
  try {
    profilePerformanceStart(GetVaccineContentPerformanceMarker);

    const config: AppConfig = await configProvider();
    const vaccineCacheFilename = VaccineInfo[vaccineType].cacheFilename;

    // fetch content from api
    const vaccineContent = await readContentFromCache(config.CONTENT_CACHE_PATH, vaccineCacheFilename, vaccineType);

    // filter and style content
    const filteredContent: VaccinePageContent = getFilteredContentForVaccine(vaccineContent);
    const styledVaccineContent: StyledVaccineContent = await getStyledContentForVaccine(
      vaccineType,
      filteredContent,
      false,
    );

    profilePerformanceEnd(GetVaccineContentPerformanceMarker);

    return { styledVaccineContent, contentError: undefined };
  } catch (error) {
    if (error instanceof ReadingS3Error || error instanceof InvalidatedCacheError) {
      return {
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      };
    } else {
      const errorMessage = error instanceof Error && error?.message != undefined ? error.message : "unknown error";
      const errorStackTrace = error instanceof Error ? error.stack : "";
      const errorCause = error instanceof Error ? error.cause : "";
      log.error(
        { error: { message: errorMessage, stack: errorStackTrace, cause: errorCause }, context: { vaccineType } },
        "Error getting content for vaccine",
      );
      return {
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      };
    }
  }
};

export { getContentForVaccine };
