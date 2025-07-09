import { EligibilityApiResponse } from "@src/services/eligibility-api/api-types";
import {
  EligibilityApiHttpStatusError,
  EligibilityApiSchemaError,
} from "@src/services/eligibility-api/gateway/exceptions";
import { EligibilityApiResponseSchema, RawEligibilityApiResponse } from "@src/services/eligibility-api/gateway/schema";
import { Cohort, Heading } from "@src/services/eligibility-api/types";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { ZodError } from "zod";

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
      validateStatus: (status) => status < HttpStatusCode.BadRequest,
    })
    .catch((error: AxiosError) => {
      log.error(error, `EliD response HTTP status error for ${nhsNumber}`);
      throw new EligibilityApiHttpStatusError(`Error in fetching ${uri}`);
    });

  try {
    const validatedApiData = EligibilityApiResponseSchema.parse(response.data);
    log.info("Eligibility status retrieved for %s", nhsNumber);
    return toDomainModel(validatedApiData);
  } catch (error) {
    if (error instanceof ZodError) {
      log.error({ zodIssues: error.issues }, `EliD response schema validation error for ${nhsNumber}`);
      throw new EligibilityApiSchemaError(`Schema validation failed for ${uri}`);
    }
    throw error;
  }
};

/**
 * Maps the validated API data to the application's internal domain model,
 * creating branded types from primitive strings.
 */
const toDomainModel = (apiResponse: RawEligibilityApiResponse): EligibilityApiResponse => {
  return {
    processedSuggestions: apiResponse.processedSuggestions.map((suggestion) => ({
      ...suggestion,
      statusText: suggestion.statusText as Heading,
      eligibilityCohorts: suggestion.eligibilityCohorts.map((cohort) => ({
        ...cohort,
        cohortText: cohort.cohortText as Cohort,
      })),
      actions: suggestion.actions.map((action) => ({
        actionType: action.actionType,
        actionCode: action.actionCode,
        description: action.description,
      })),
    })),
  };
};
