import { readCachedContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-cache-reader";
import { vitaContentChangedSinceLastApproved } from "@src/_lambda/content-cache-hydrator/content-change-detector";
import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { invalidateCacheForVaccine } from "@src/_lambda/content-cache-hydrator/invalidate-cache";
import { VaccineTypes } from "@src/models/vaccine";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import { VaccinePageContent } from "@src/services/content-api/types";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { Context } from "aws-lambda";

const log = logger.child({ module: "content-cache-hydrator" });

// TODO: When cache is valid and content has changed - cache is invalidated for RSV, but when forceUpdate=true it is validated again for RSV-pregnancy

const checkContentPassesStylingAndWriteToCache = async (
  vaccine: VaccineTypes,
  content: string,
  filteredContent: VaccinePageContent,
): Promise<void> => {
  try {
    await getStyledContentForVaccine(vaccine, filteredContent);
    await writeContentForVaccine(vaccine, content);
  } catch (error) {
    log.error(
      {
        context: {
          vaccine: vaccine,
          contentLength: content.length,
        },
      },
      "Check failed in styling or writing content to cache.",
    );
    throw error;
  }
};

interface HydrateCacheStatus {
  invalidatedCount: number;
  failureCount: number;
}

async function hydrateCacheForVaccine(
  vaccine: VaccineTypes,
  approvalEnabled: boolean,
  forceUpdate: boolean,
): Promise<HydrateCacheStatus> {
  const status: HydrateCacheStatus = { invalidatedCount: 0, failureCount: 0 };

  try {
    const content: string = await fetchContentForVaccine(vaccine);
    const filteredContent: VaccinePageContent = getFilteredContentForVaccine(content);

    if (!approvalEnabled) {
      await checkContentPassesStylingAndWriteToCache(vaccine, content, filteredContent);
      return status;
    } else {
      const { cacheStatus, cacheContent } = await readCachedContentForVaccine(vaccine);

      if (cacheStatus === "empty" || (cacheStatus === "invalidated" && forceUpdate)) {
        log.info(
          { context: { vaccine: vaccine, cacheStatus: cacheStatus, forceUpdate: forceUpdate } },
          `Cache was ${cacheStatus} previously, writing updated content.`,
        );
        await checkContentPassesStylingAndWriteToCache(vaccine, content, filteredContent);
        return status;
      }

      if (cacheStatus === "invalidated" && !forceUpdate) {
        log.info({ context: { vaccine: vaccine } }, "Cache is invalidated already, no action taken.");
        status.invalidatedCount++;
        return status;
      }

      if (cacheStatus === "valid") {
        if (vitaContentChangedSinceLastApproved(filteredContent, getFilteredContentForVaccine(cacheContent))) {
          log.info(`Content changes detected for vaccine ${vaccine}; invalidating cache`);
          await invalidateCacheForVaccine(vaccine);
          status.invalidatedCount++;
          return status;
        } else {
          await checkContentPassesStylingAndWriteToCache(vaccine, content, filteredContent);
          return status;
        }
      }
      throw new Error("Unexpected scenario, should never have happened.");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "unknown error";
    const errorStackTrace = error instanceof Error ? error.stack : "";
    const errorCause = error instanceof Error ? error.cause : "";
    log.error(
      { context: { vaccine }, error: { message: errorMessage, stack: errorStackTrace, cause: errorCause } },
      "Error occurred for vaccine.",
    );
    status.failureCount++;
    return status;
  }
}

interface ContentCacheHydratorEvent {
  forceUpdate?: boolean;
}

// Ref: https://nhsd-confluence.digital.nhs.uk/spaces/Vacc/pages/1113364124/Caching+strategy+for+content+from+NHS.uk+content+API
const runContentCacheHydrator = async (event: ContentCacheHydratorEvent) => {
  log.info({ context: { event } }, "Received event, hydrating content cache.");

  const config: AppConfig = await configProvider();

  let failureCount: number = 0;
  let invalidatedCount: number = 0;
  const forceUpdate = typeof event.forceUpdate === "boolean" ? event.forceUpdate : false;
  for (const vaccine of Object.values(VaccineTypes)) {
    const status = await hydrateCacheForVaccine(vaccine, config.CONTENT_CACHE_IS_CHANGE_APPROVAL_ENABLED, forceUpdate);
    invalidatedCount += status.invalidatedCount;
    failureCount += status.failureCount;
  }

  log.info({ context: { failureCount, invalidatedCount } }, "Finished hydrating content cache: report.");
  if (failureCount > 0) {
    throw new Error(`${failureCount} failures`);
  }
};

export const handler = async (event: object, context: Context): Promise<void> => {
  const requestContext: RequestContext = {
    traceId: context.awsRequestId,
  };

  await asyncLocalStorage.run(requestContext, () => runContentCacheHydrator(event));
};
