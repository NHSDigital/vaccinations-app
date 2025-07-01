import { AppConfig, configProvider } from "@src/utils/config";
import axios, { AxiosResponse, AxiosError, HttpStatusCode } from "axios";
import { logger } from "@src/utils/logger";
import { EligibilityApiResponse } from "@src/services/eligibility-api/api-types";
import { EligibilityApiHttpStatusError } from "@src/services/eligibility-api/gateway/exceptions";

const log = logger.child({ module: "fetch-eligibility-content" });
const ELIGIBILITY_API_PATH_SUFFIX =
  "eligibility-signposting-api/patient-check/";

export const fetchEligibilityContent = async (
  nhsNumber: string,
): Promise<EligibilityApiResponse> => {
  const config: AppConfig = await configProvider();

  const apiEndpoint: string = config.ELIGIBILITY_API_ENDPOINT;
  const apiKey: string = config.ELIGIBILITY_API_KEY;
  const vitaTraceId: string | undefined = process.env._X_AMZN_TRACE_ID;

  const uri: string = `${apiEndpoint}${ELIGIBILITY_API_PATH_SUFFIX}${nhsNumber}`;

  log.info("Fetching content from %s", uri);
  const response: AxiosResponse = await axios
    .get(uri, {
      headers: {
        accept: "application/json, application/fhir+json",
        apikey: apiKey,
        "X-Correlation-ID": vitaTraceId,
      },
      validateStatus: (status) => {
        return status < HttpStatusCode.BadRequest;
      },
    })
    .catch((error: AxiosError) => {
      log.error(error, `Error in fetching ${uri}`);
      throw new EligibilityApiHttpStatusError(
        `Error in fetching ${uri} - ${error.toJSON()}`,
      );
    });
  return response.data; // TODO - VIA-331, SB MD - deserialise using https://zod.dev? And throw EligibilityApiSchemaError?
};
