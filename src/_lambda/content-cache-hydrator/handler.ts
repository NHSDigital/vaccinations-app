import writeContentToCache from "@src/_lambda/content-cache-hydrator/content-cache-writer";
import { VaccineTypes } from "@src/models/vaccine";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "content-cache-hydrator" });

type HydrateEvent = {
  name: string;
  value: number;
};

type HydrateResponse = {
  statusCode: number;
  body: string;
};

export const handler = async (
  event: HydrateEvent,
): Promise<HydrateResponse> => {
  log.info(event, "Received event, hydrating content cache.");

  let hydrateResponse: HydrateResponse;
  try {
    for (const vaccine in VaccineTypes) {
      log.info("Fetching content for vaccine %s", vaccine);
      await writeContentToCache();
    }

    hydrateResponse = {
      statusCode: 200,
      body: JSON.stringify("Success when hydrating content cache."),
    };
  } catch (error) {
    log.error(`Error occurred when hydrating content cache: ${error}`);
    hydrateResponse = {
      statusCode: 500,
      body: JSON.stringify(
        `Error occurred when hydrating content cache: ${error}`,
      ),
    };
  }
  return hydrateResponse;
};

export type { HydrateEvent, HydrateResponse };
