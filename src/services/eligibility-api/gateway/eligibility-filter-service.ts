import { VaccineTypes } from "@src/models/vaccine";
import {
  EligibilityApiResponse,
  EligibilityCohort,
  EligibilityContent,
  EligibilityErrorTypes,
  EligibilityForPerson,
  EligibilityStatus,
  ProcessedSuggestion,
} from "@src/services/eligibility-api/types";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { Logger } from "pino";
import { logger } from "@src/utils/logger";
import { Session } from "next-auth";
import { auth } from "@project/auth";

const log: Logger = logger.child({ module: "eligibility-filter-service" });

const getEligibilityForPerson = async (
  vaccineType: VaccineTypes,
): Promise<EligibilityForPerson> => {
  const session: Session | null = await auth();

  if (!session) {
    return {
      eligibilityStatus: EligibilityStatus.EMPTY,
      eligibilityContent: undefined,
      eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
    };
  }

  const eligibilityApiResponse: EligibilityApiResponse =
    await fetchEligibilityContent(session.user.nhs_number);

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
  if (!suggestion.eligibilityCohorts) {
    log.error(
      "Error deserializing object, missing attribute: ProcessedSuggestion.eligibilityCohorts",
    );
    return undefined;
  }
  if (suggestion.eligibilityCohorts.length === 0) {
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
