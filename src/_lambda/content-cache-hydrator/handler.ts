import writeContentToCache from "@src/_lambda/content-cache-hydrator/content-cache-writer";
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

const handler = async (event: HydrateEvent): Promise<HydrateResponse> => {
  log.info(event, "Received event, hydrating content cache.");

  let hydrateResponse: HydrateResponse;
  try {
    await writeContentToCache();
    hydrateResponse = {
      statusCode: 200,
      body: "Success when hydrating content cache.",
    };
  } catch (error) {
    log.error(`Error occurred when hydrating content cache: ${error}`);
    hydrateResponse = {
      statusCode: 500,
      body: `Error occurred when hydrating content cache: ${error}`,
    };
  }
  return hydrateResponse;
};

export default handler;
export type { HydrateEvent, HydrateResponse };
