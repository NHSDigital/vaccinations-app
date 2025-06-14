import { AppConfig, configProvider } from "@src/utils/config";
import axios, { AxiosResponse } from "axios";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "fetch-eligibility-content" });
const ELIGIBILITY_API_PATH_SUFFIX = "patient-check";

export const fetchEligibilityContent = async (nhsNumber: string) => {
  const config: AppConfig = await configProvider();

  const apiEndpoint: string = config.ELIGIBILITY_API_ENDPOINT;
  const apiKey: string = config.ELIGIBILITY_API_KEY;

  const uri: string = `${apiEndpoint}${ELIGIBILITY_API_PATH_SUFFIX}/${nhsNumber}`;
  let response: AxiosResponse;
  try {
    log.info("Fetching content from %s", uri);
    response = await axios.get(uri, {
      headers: {
        accept: "application/json",
        apikey: apiKey,
      },
    });
    log.info("Successfully fetched content from %s", uri);
    return response.data;
  } catch (error) {
    console.error("Aggregate error caught:", error);
    log.error(`Error in fetching ${uri}: ${error}`);
    throw error;
  }
};
