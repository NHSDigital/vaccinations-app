import { VaccineTypes } from "@src/models/vaccine";
import {
  EligibilityApiResponse,
  EligibilityCohort,
  EligibilityContent,
  EligibilityStatus,
  EligibilityForPerson,
  ProcessedSuggestion,
} from "@src/services/eligibility-api/types";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { Logger } from "pino";
import { logger } from "@src/utils/logger";

const log: Logger = logger.child({ module: "eligibility-filter-service" });

const getEligibilityForPerson = async (
  nhsNumber: string,
  vaccineType: VaccineTypes,
): Promise<EligibilityForPerson> => {
  const eligibilityApiResponse: EligibilityApiResponse =
    await fetchEligibilityContent(nhsNumber);

  const suggestion: ProcessedSuggestion | undefined =
    eligibilityApiResponse.processedSuggestions.find(
      ({ condition }: ProcessedSuggestion) => condition === vaccineType,
    );

  const introduction: string = "This is because you:";

  let bulletPoints: string[] | undefined;
  let heading: string = "";
  let status: EligibilityStatus = EligibilityStatus.EMPTY;
  if (suggestion) {
    status = _getStatus(suggestion);
    heading = suggestion.statusText;
    bulletPoints = _generateBulletPoints(suggestion);
  } else {
    log.error(
      `Error accessing processedSuggestion from Eligibility API, no suggestion for ${vaccineType} given.`,
    );
  }

  const eligibilityContent: EligibilityContent | undefined = bulletPoints
    ? {
        status: {
          heading,
          introduction,
          points: bulletPoints,
        },
      }
    : undefined;

  return {
    eligibilityStatus: status,
    eligibilityContent,
    eligibilityError: undefined,
  };
};

const _generateBulletPoints = (
  suggestion: ProcessedSuggestion,
): string[] | undefined => {
  if (suggestion.eligibilityCohorts.length === 0) {
    log.error(
      "Error accessing eligibilityCohorts from Eligibility API. Cohorts are empty array.",
    );
    return undefined;
  }
  return suggestion.eligibilityCohorts.map(
    (cohort: EligibilityCohort) => cohort.cohortText,
  );
};

const _getStatus = (suggestion: ProcessedSuggestion) => {
  if (suggestion.status === EligibilityStatus.NOT_ELIGIBLE) {
    return EligibilityStatus.NOT_ELIGIBLE;
  } else {
    return EligibilityStatus.EMPTY;
  }
};

export { getEligibilityForPerson, _generateBulletPoints, _getStatus };
