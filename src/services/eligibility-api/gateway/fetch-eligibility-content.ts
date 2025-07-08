import { EligibilityApiResponse } from "@src/services/eligibility-api/api-types";
import { EligibilityApiHttpStatusError } from "@src/services/eligibility-api/gateway/exceptions";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";

const log = logger.child({ module: "fetch-eligibility-content" });
const ELIGIBILITY_API_PATH_SUFFIX = "eligibility-signposting-api/patient-check/";

export const fetchEligibilityContent = async (nhsNumber: string): Promise<EligibilityApiResponse> => {
  const config: AppConfig = await configProvider();

  const apiEndpoint: URL = config.ELIGIBILITY_API_ENDPOINT;
  const apiKey: string = config.ELIGIBILITY_API_KEY;
  const vitaTraceId: string | undefined = process.env._X_AMZN_TRACE_ID;

  const uri: string = `${apiEndpoint}${ELIGIBILITY_API_PATH_SUFFIX}${nhsNumber}`;

  log.info("Fetching eligibility status from %s", uri);
  const response: AxiosResponse = await axios
    .get(uri, {
      headers: {
        accept: "application/json, application/fhir+json",
        apikey: apiKey,
        "X-Correlation-ID": vitaTraceId,
      },
      timeout: 5000,
      validateStatus: (status) => {
        return status < HttpStatusCode.BadRequest;
      },
    })
    .catch((error: AxiosError) => {
      log.error(error, `EliD response HTTP status error for ${nhsNumber}`);
      throw new EligibilityApiHttpStatusError(`Error in fetching ${uri}`);
    });
  log.info("Eligibility status retrieved for %s", nhsNumber);
  return response.data; // TODO - deserialise using https://zod.dev or similar, and throw EligibilityApiSchemaError?
};
