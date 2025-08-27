import { loadCachedFilteredContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-cache-reader";
import { vitaContentChangedSinceLastApproved } from "@src/_lambda/content-cache-hydrator/content-change-detector";
import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { invalidateCacheForVaccine } from "@src/_lambda/content-cache-hydrator/invalidate-cache";
import { VaccineTypes } from "@src/models/vaccine";
import { InvalidatedCacheError, S3NoSuchKeyError } from "@src/services/content-api/gateway/exceptions";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import { VaccinePageContent } from "@src/services/content-api/types";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { Context } from "aws-lambda";

const log = logger.child({ module: "content-writer-lambda" });

async function hydrateCacheForVaccine(vaccine: VaccineTypes, approvalEnabled: boolean, forceUpdate: boolean) {
  const status = { invalidatedCount: 0, failureCount: 0 };

  try {
    const content: string = await fetchContentForVaccine(vaccine);
    const filteredContent: VaccinePageContent = getFilteredContentForVaccine(content);

    if (approvalEnabled) {
      try {
        const previousApprovedContent = await loadCachedFilteredContentForVaccine(vaccine);
        if (vitaContentChangedSinceLastApproved(filteredContent, previousApprovedContent)) {
          log.info(`Content changes detected for vaccine ${vaccine}; invalidating cache`);
          await invalidateCacheForVaccine(vaccine);
          status.invalidatedCount++;
          return status;
        }
      } catch (error) {
        if (error instanceof S3NoSuchKeyError) {
          log.info(`Content cache for vaccine ${vaccine} currently empty; continuing to update cache`);
        } else if (error instanceof InvalidatedCacheError) {
          if (forceUpdate) {
            await getStyledContentForVaccine(vaccine, filteredContent);
            await writeContentForVaccine(vaccine, content);
            return status;
          } else {
            log.error(`Content cache for vaccine ${vaccine} has already been invalidated in a previous run`);
            status.invalidatedCount++;
            return status;
          }
        } else {
          throw error;
        }
      }
    }
    await getStyledContentForVaccine(vaccine, filteredContent);
    await writeContentForVaccine(vaccine, content);
    return status;
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

const runContentCacheHydrator = async (event: ContentCacheHydratorEvent) => {
  log.info({ context: { event } }, "Received event, hydrating content cache.");

  const config: AppConfig = await configProvider();

  let failureCount: number = 0;
  let invalidatedCount: number = 0;
  const forceUpdate = event.forceUpdate ?? false;
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
