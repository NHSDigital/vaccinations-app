import writeContentToCache from "@src/_lambda/content-cache-hydrator/content-cache-writer";
import { VaccineTypes } from "@src/models/vaccine";
import { vaccineTypeToPath } from "@src/services/content-api/constants";
import configProvider from "@src/utils/config";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "content-cache-hydrator" });

type HydrateResponse = {
  statusCode: number;
  body: string;
};

export const handler = async (event: never): Promise<HydrateResponse> => {
  log.info(event, "Received event, hydrating content cache.");
  const config = await configProvider();

  let failureCount: number = 0;
  for (const vaccine of Object.values(VaccineTypes)) {
    let content: string;
    try {
      log.info("Fetching content for %s", vaccine);
      content = "{}"; //TODO: fetch real content
      log.info("Successfully fetched content for %s", vaccine);
    } catch (error) {
      log.error("Error occurred in fetching vaccine %s, %s", vaccine, error);
      failureCount++;
      continue;
    }

    //TODO: run contract checks

    try {
      log.info("Writing content for %s", vaccine);
      await writeContentToCache(
        config.CONTENT_CACHE_PATH,
        `${vaccineTypeToPath[vaccine]}.json`,
        content,
      );
      log.info("Successfully wrote content for %s", vaccine);
    } catch (error) {
      log.error(
        "Error occurred in writing content for vaccine %s, %s",
        vaccine,
        error,
      );
      failureCount++;
    }
  }

  let hydrateResponse: HydrateResponse;
  if (failureCount > 0) {
    hydrateResponse = {
      statusCode: 500,
      body: JSON.stringify(
        `Error(s) occurred when hydrating content cache: #${failureCount}`,
      ),
    };
  } else {
    hydrateResponse = {
      statusCode: 200,
      body: JSON.stringify("Successfully hydrated content cache."),
    };
  }

  return hydrateResponse;
};

export type { HydrateResponse };
