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
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { ZodError } from "zod";

const log = logger.child({ module: "fetch-eligibility-content" });
const ELIGIBILITY_API_PATH_SUFFIX = "eligibility-signposting-api/patient-check/";

export const fetchEligibilityContent = async (nhsNumber: NhsNumber): Promise<EligibilityApiResponse> => {
  const config: AppConfig = await configProvider();

  const apiEndpoint: URL = config.ELIGIBILITY_API_ENDPOINT;
  const apiKey: string = config.ELIGIBILITY_API_KEY;
  const vitaTraceId: string | undefined = process.env._X_AMZN_TRACE_ID;

  const uri: string = `${apiEndpoint}${ELIGIBILITY_API_PATH_SUFFIX}${nhsNumber}`;

  log.info({ nhsNumber }, "Fetching eligibility status from %s", uri);
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
      log.error({ nhsNumber, error }, `EliD response HTTP status error`);
      throw new EligibilityApiHttpStatusError(`Error in fetching ${uri}`);
    });
  log.info({ nhsNumber }, "Eligibility status retrieved");
  try {
    const validatedApiData = EligibilityApiResponseSchema.parse(response.data);
    log.debug({ nhsNumber, validatedApiData }, "Eligibility status data validated");
    return toDomainModel(validatedApiData);
  } catch (error) {
    if (error instanceof ZodError) {
      log.error(
        { nhsNumber, uri, responseData: response.data, schemaIssues: error.issues },
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
