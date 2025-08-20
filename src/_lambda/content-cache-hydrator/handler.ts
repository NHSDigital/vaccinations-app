import { isError } from "@jest/expect-utils";
import { vitaContentChangedSinceLastApproved } from "@src/_lambda/content-cache-hydrator/content-change-detector";
import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { invalidateCacheForVaccine } from "@src/_lambda/content-cache-hydrator/invalidate-cache";
import { VaccineTypes } from "@src/models/vaccine";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import { VaccinePageContent } from "@src/services/content-api/types";
import { logger } from "@src/utils/logger";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { Context } from "aws-lambda";

const log = logger.child({ module: "content-writer-lambda" });

const runContentCacheHydrator = async (event: object) => {
  log.info({ context: { event } }, "Received event, hydrating content cache.");

  let failureCount: number = 0;
  for (const vaccine of Object.values(VaccineTypes)) {
    try {
      const content: string = await fetchContentForVaccine(vaccine);
      const filteredContent: VaccinePageContent = getFilteredContentForVaccine(content);

      // VIA-378 Temporary feature toggle
      const DETECT_CONTENT_CHANGES_ENABLED: boolean = false;
      if (DETECT_CONTENT_CHANGES_ENABLED) {
        if (await vitaContentChangedSinceLastApproved(filteredContent, vaccine)) {
          log.info(`Content changes detected for vaccine ${vaccine}; invalidating cache`);
          await invalidateCacheForVaccine(vaccine);
          throw new Error(`Content changes detected for vaccine: ${vaccine}`);
        }
      }

      await getStyledContentForVaccine(vaccine, filteredContent);
      await writeContentForVaccine(vaccine, content);
    } catch (error) {
      const errorMessage = isError(error) ? error.message : "unknown error";
      log.error({ context: { vaccine }, error: { message: errorMessage } }, "Error occurred for vaccine.");
      failureCount++;
    }
  }

  log.info({ context: { failureCount } }, "Finished hydrating content cache with failures.");
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
