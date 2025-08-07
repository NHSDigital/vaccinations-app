import { NhsNumber } from "@src/models/vaccine";
import { ActionType, EligibilityApiResponse, RuleCode } from "@src/services/eligibility-api/api-types";
import {
  EligibilityApiResponseSchema,
  RawEligibilityApiResponse,
} from "@src/services/eligibility-api/gateway/elid-schema";
import {
  EligibilityApiHttpStatusError,
  EligibilityApiSchemaError,
} from "@src/services/eligibility-api/gateway/exceptions";
import { Cohort, Heading } from "@src/services/eligibility-api/types";
import { getApimAccessToken } from "@src/utils/auth/apim/get-apim-access-token";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { ZodError } from "zod";

type Headers = {
  accept: string;
  apikey: string;
  "X-Correlation-ID": string | undefined;
  Authorization?: string;
};

const log = logger.child({ module: "fetch-eligibility-content" });
const ELIGIBILITY_API_PATH_SUFFIX = "eligibility-signposting-api/patient-check/";

export const fetchEligibilityContent = async (nhsNumber: NhsNumber): Promise<EligibilityApiResponse> => {
  const config: AppConfig = await configProvider();

  const apiEndpoint: URL = config.ELIGIBILITY_API_ENDPOINT;
  const apiKey: string = config.ELIGIBILITY_API_KEY;
  const vitaTraceId: string | undefined = process.env._X_AMZN_TRACE_ID;

  const uri: string = `${apiEndpoint}${ELIGIBILITY_API_PATH_SUFFIX}${nhsNumber}`;
  let headers: Headers = {
    accept: "application/json, application/fhir+json",
    apikey: apiKey,
    "X-Correlation-ID": vitaTraceId,
  };

  if (config.IS_APIM_AUTH_ENABLED) {
    const apimAccessToken = await getApimAccessToken();
    headers = { ...headers, Authorization: `Bearer ${apimAccessToken}` };
  }

  log.info({ nhsNumber, uri: uri }, "Fetching eligibility status");
  const response: AxiosResponse<EligibilityApiResponse> = await axios
    .get(uri, {
      headers,
      timeout: 5000,
      validateStatus: (status) => {
        return status < HttpStatusCode.BadRequest;
      },
    })
    .catch((error: AxiosError) => {
      log.error({ nhsNumber, error, response_data: error.response?.data }, `EliD response HTTP status error`);
      throw new EligibilityApiHttpStatusError(`Error in fetching ${uri}`);
    });
  log.info({ nhsNumber }, "Eligibility status retrieved");
  try {
    const validatedApiData = EligibilityApiResponseSchema.parse(response.data);
    log.info({ nhsNumber, validatedApiData }, "Eligibility status data validated");
    return toDomainModel(validatedApiData);
  } catch (error) {
    if (error instanceof ZodError) {
      log.error(
        { nhsNumber, uri, response_data: response.data, schema_issues: error.issues },
        "EliD response schema validation error",
      );
      throw new EligibilityApiSchemaError(`Schema validation failed for ${uri}`);
    }
    throw error;
  }
};

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
        actionType: action.actionType as ActionType,
        description: action.description,
        url: action.urlLink ? new URL(action.urlLink) : undefined,
        urlLabel: action.urlLabel,
      })),
      suitabilityRules: suggestion.suitabilityRules.map((rule) => ({
        ruleCode: rule.ruleCode as RuleCode,
        ruleText: rule.ruleText,
      })),
    })),
  };
};
