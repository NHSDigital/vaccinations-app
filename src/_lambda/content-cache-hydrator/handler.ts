import { readCachedContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-cache-reader";
import { vitaContentChangedSinceLastApproved } from "@src/_lambda/content-cache-hydrator/content-change-detector";
import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { invalidateCacheForVaccine } from "@src/_lambda/content-cache-hydrator/invalidate-cache";
import { VaccineType } from "@src/models/vaccine";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import { VaccinePageContent } from "@src/services/content-api/types";
import config from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { getVaccineTypeFromLowercaseString } from "@src/utils/path";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { Context } from "aws-lambda";
import { delay, retry } from "es-toolkit";

const log = logger.child({ module: "content-cache-hydrator" });

const checkContentPassesStylingAndWriteToCache = async (
  vaccineType: VaccineType,
  content: string,
  filteredContent: VaccinePageContent,
): Promise<void> => {
  try {
    await getStyledContentForVaccine(vaccineType, filteredContent, true);
    await writeContentForVaccine(vaccineType, content);
    log.info({ context: { vaccineType } }, `Content written to cache for vaccine ${vaccineType} `);
  } catch (error) {
    log.error(
      {
        context: {
          vaccineType,
          contentLength: content.length,
        },
      },
      "Vaccine content either failed styling check or encountered write error",
    );
    throw error;
  }
};

interface HydrateCacheStatus {
  invalidatedCount: number;
  failureCount: number;
}

async function hydrateCacheForVaccine(
  vaccineType: VaccineType,
  approvalEnabled: boolean,
  forceUpdate: boolean,
): Promise<HydrateCacheStatus> {
  log.info({ context: { vaccineType } }, "Hydrating cache for given vaccine");
  const status: HydrateCacheStatus = { invalidatedCount: 0, failureCount: 0 };

  const rateLimitDelayMillis: number = 1000 / ((await config.CONTENT_API_RATE_LIMIT_PER_MINUTE) / 60);
  const rateLimitDelayWithMargin: number = 2 * rateLimitDelayMillis; // to keep ourselves well within the budget

  try {
    const content: string = await retry(async () => fetchContentForVaccine(vaccineType), {
      retries: 5,
      delay: (attempt: number) => {
        const delayMillis = rateLimitDelayWithMargin * Math.pow(2, attempt + 1);
        log.warn(
          { context: { vaccineType, attempt, delayMillis } },
          "Failed to fetch content for given vaccine, trying again",
        );
        return delayMillis;
      },
    });
    const filteredContent: VaccinePageContent = await getFilteredContentForVaccine(vaccineType, content);

    if (!approvalEnabled) {
      await checkContentPassesStylingAndWriteToCache(vaccineType, content, filteredContent);
      return status;
    }

    const { cacheStatus, cacheContent } = await readCachedContentForVaccine(vaccineType);

    if (cacheStatus === "empty" || (cacheStatus === "invalidated" && forceUpdate)) {
      log.info(
        { context: { vaccineType, cacheStatus, forceUpdate } },
        `Cache was ${cacheStatus} previously, writing updated content`,
      );
      await checkContentPassesStylingAndWriteToCache(vaccineType, content, filteredContent);
      return status;
    }

    if (cacheStatus === "invalidated" && !forceUpdate) {
      log.info(
        { context: { vaccineType, cacheStatus, forceUpdate } },
        `Content changes detected for vaccine ${vaccineType} : cache is already invalidated, no action taken`,
      );
      status.invalidatedCount++;
      return status;
    }

    if (cacheStatus === "valid") {
      if (
        vitaContentChangedSinceLastApproved(
          filteredContent,
          await getFilteredContentForVaccine(vaccineType, cacheContent),
        )
      ) {
        log.info(
          { context: { vaccineType } },
          `Content changes detected for vaccine ${vaccineType}; invalidating cache`,
        );
        await invalidateCacheForVaccine(vaccineType);
        status.invalidatedCount++;
        return status;
      } else {
        await checkContentPassesStylingAndWriteToCache(vaccineType, content, filteredContent);
        return status;
      }
    }
  } catch (error) {
    log.error(
      {
        context: { vaccineType },
        error: error instanceof Error ? { message: error.message, stack: error.stack, cause: error.cause } : error,
      },
      "Error occurred for vaccine",
    );
    status.failureCount++;
    return status;
  }

  log.error("Unexpected content hydration scenario, should never have happened");
  status.failureCount++;
  return status;
}

interface ContentCacheHydratorEvent {
  forceUpdate?: boolean;
  vaccineToUpdate?: string;
}

// Ref: https://nhsd-confluence.digital.nhs.uk/spaces/Vacc/pages/1113364124/Caching+strategy+for+content+from+NHS.uk+content+API
const runContentCacheHydrator = async (event: ContentCacheHydratorEvent) => {
  log.info({ context: { event } }, "Received event, hydrating content cache.");

  const forceUpdate = typeof event.forceUpdate === "boolean" ? event.forceUpdate : false;

  let vaccinesToRunOn: VaccineType[];
  if (event.vaccineToUpdate) {
    const vaccineType = getVaccineTypeFromLowercaseString(event.vaccineToUpdate);
    if (typeof vaccineType === "undefined") {
      const errorMessage = `Bad request: Vaccine name not recognised: ${event.vaccineToUpdate}`;
      log.error({ context: { vaccineType: event.vaccineToUpdate } }, errorMessage);
      throw new Error(errorMessage);
    } else {
      vaccinesToRunOn = [vaccineType];
    }
  } else {
    vaccinesToRunOn = Object.values(VaccineType);
  }

  if (forceUpdate) {
    log.info(
      { context: { vaccineType: event.vaccineToUpdate, forceUpdate } },
      "Clinical approval received for force update of vaccine",
    );
  }

  let failureCount: number = 0;
  let invalidatedCount: number = 0;

  const rateLimitDelayMillis: number = 1000 / ((await config.CONTENT_API_RATE_LIMIT_PER_MINUTE) / 60);
  const rateLimitDelayWithMargin: number = 2.5 * rateLimitDelayMillis; // to keep ourselves well within the budget
  log.info(`Delay used between calls to rate limit content API is ${rateLimitDelayWithMargin}ms`);

  for (const vaccine of vaccinesToRunOn) {
    const status = await hydrateCacheForVaccine(
      vaccine,
      await config.CONTENT_CACHE_IS_CHANGE_APPROVAL_ENABLED,
      forceUpdate,
    );

    invalidatedCount += status.invalidatedCount;
    failureCount += status.failureCount;

    await delay(rateLimitDelayWithMargin); // sleep to rate limit
  }

  log.info({ context: { failureCount, invalidatedCount } }, "Finished hydrating content cache: report");
  if (failureCount > 0) {
    throw new Error(`${failureCount} failures`);
  }
  if (invalidatedCount > 0) {
    log.error({ context: { invalidatedCount } }, "Cache invalidation(s) found. Needs approval and force update");
  }
};

export const handler = async (event: object, context: Context): Promise<void> => {
  const requestContext: RequestContext = {
    traceId: context.awsRequestId,
    nextUrl: "",
  };

  await asyncLocalStorage.run(requestContext, () => runContentCacheHydrator(event));
};
