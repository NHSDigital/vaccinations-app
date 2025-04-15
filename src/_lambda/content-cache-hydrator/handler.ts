import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
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
    try {
      const content: string = await fetchContentForVaccine(vaccine);
      //TODO: run contract checks
      await writeContentForVaccine(vaccine, content);
    } catch (error) {
      log.error("Error occurred for vaccine %s: %s", vaccine, error);
      failureCount++;
    }
  }

  log.info(`Finished hydrating content cache with ${failureCount} failures.`);
  return {
    statusCode: failureCount > 0 ? 500 : 200,
    body: `${failureCount} failures`,
  } as HydrateResponse;
};

export type { HydrateResponse };
