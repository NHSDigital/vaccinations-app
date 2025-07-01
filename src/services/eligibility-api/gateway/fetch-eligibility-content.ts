import { AppConfig, configProvider } from "@src/utils/config";
import axios, { AxiosResponse, AxiosError } from "axios";
import { logger } from "@src/utils/logger";
import {
  EligibilityApiErrorTypes,
  EligibilityApiResponse,
} from "@src/services/eligibility-api/api-types";
import { Result } from "true-myth";

const log = logger.child({ module: "fetch-eligibility-content" });
const ELIGIBILITY_API_PATH_SUFFIX =
  "eligibility-signposting-api/patient-check/";

export const fetchEligibilityContent = async (
  nhsNumber: string,
): Promise<Result<EligibilityApiResponse, EligibilityApiErrorTypes>> => {
  const config: AppConfig = await configProvider();

  const apiEndpoint: string = config.ELIGIBILITY_API_ENDPOINT;
  const apiKey: string = config.ELIGIBILITY_API_KEY;
  const vitaTraceId: string | undefined = process.env._X_AMZN_TRACE_ID;

  const uri: string = `${apiEndpoint}${ELIGIBILITY_API_PATH_SUFFIX}${nhsNumber}`;

  log.info("Fetching content from %s", uri);
  axios
    .get(uri, {
      headers: {
        accept: "application/json",
        apikey: apiKey,
        "X-Correlation-ID": vitaTraceId,
      },
      validateStatus: (status) => {
        return status < 400;
      },
    })
    .then((response: AxiosResponse) => {
      log.info("Successfully fetched content from %s", uri);
      return Result.ok(response.data);
    })
    .catch((error: AxiosError) => {
      log.error(error, `Error in fetching ${uri}`);
      return Result.err(EligibilityApiErrorTypes.HTTP_STATUS_ERROR);
    })
    .finally(() => {
      return Result.err(EligibilityApiErrorTypes.UNEXPECTED); // Should never happen...
    });
  throw new Error("Should never happen");
};
