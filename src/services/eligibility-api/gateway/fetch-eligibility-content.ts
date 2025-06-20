import { AppConfig, configProvider } from "@src/utils/config";
import axios, { AxiosResponse } from "axios";
import { logger } from "@src/utils/logger";
import { EligibilityApiResponse } from "@src/services/eligibility-api/api-types";

const log = logger.child({ module: "fetch-eligibility-content" });
const ELIGIBILITY_API_PATH_SUFFIX =
  "eligibility-signposting-api/patient-check/";

export const fetchEligibilityContent = async (
  nhsNumber: string,
): Promise<EligibilityApiResponse | undefined> => {
  const config: AppConfig = await configProvider();

  const apiEndpoint: string = config.ELIGIBILITY_API_ENDPOINT;
  const apiKey: string = config.ELIGIBILITY_API_KEY;
  const vitaTraceId: string | undefined = process.env._X_AMZN_TRACE_ID;

  const uri: string = `${apiEndpoint}${ELIGIBILITY_API_PATH_SUFFIX}${nhsNumber}`;
  let response: AxiosResponse;
  try {
    log.info("Fetching content from %s", uri);
    response = await axios.get(uri, {
      headers: {
        accept: "application/json",
        apikey: apiKey,
        "X-Request-ID": vitaTraceId,
      },
    });
    log.info("Successfully fetched content from %s", uri);
    return response.data;
  } catch (error) {
    log.error(error, `Error in fetching ${uri}`);
    return undefined;
  }
};
