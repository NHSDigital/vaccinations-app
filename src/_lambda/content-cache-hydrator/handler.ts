import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { VaccineTypes } from "@src/models/vaccine";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "content-writer-lambda" });

type HydrateResponse = {
  statusCode: number;
  body: string;
};

export const handler = async (event: never): Promise<HydrateResponse> => {
  log.info(event, "Received event, hydrating content cache.");

  let failureCount: number = 0;
  for (const vaccine of Object.values(VaccineTypes)) {
    let content: string;
    try {
      content = "{}"; //TODO: fetch real content
    } catch (error) {
      log.error("Error occurred in fetching vaccine %s, %s", vaccine, error);
      failureCount++;
      continue;
    }

    //TODO: run contract checks

    try {
      await writeContentForVaccine(vaccine, content);
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
