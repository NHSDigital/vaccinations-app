import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { VaccineTypes } from "@src/models/vaccine";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import { VaccinePageContent } from "@src/services/content-api/types";
import { logger } from "@src/utils/logger";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { Context } from "aws-lambda";

const log = logger.child({ module: "content-writer-lambda" });

const runContentCacheHydrator = async (event: object) => {
  log.info(event, "Received event, hydrating content cache.");

  let failureCount: number = 0;
  for (const vaccine of Object.values(VaccineTypes)) {
    try {
      const content: string = await fetchContentForVaccine(vaccine);
      log.info(`Calling getFilteredContentForVaccine(${vaccine})`);
      const filteredContent: VaccinePageContent = getFilteredContentForVaccine(content);
      log.info(`Calling getStyledContentForVaccine(${vaccine})`);
      await getStyledContentForVaccine(vaccine, filteredContent);
      await writeContentForVaccine(vaccine, content);
    } catch (error) {
      log.error(`Error occurred for vaccine ${vaccine}: ${error}.`);
      failureCount++;
    }
  }

  log.info(`Finished hydrating content cache with ${failureCount} failures.`);
  if (failureCount > 0) {
    throw new Error(`${failureCount} failures`);
  }
};

export const handler = async (event: object, context: Context): Promise<void> => {
  const requestContext: RequestContext = {
    requestId: context.awsRequestId,
  };

  await asyncLocalStorage.run(requestContext, () => runContentCacheHydrator(event));
};
