import { VaccineTypes } from "@src/models/vaccine";
import { EligibilityCohort, ProcessedSuggestion } from "@src/services/eligibility-api/api-types";
import { EligibilityApiError } from "@src/services/eligibility-api/gateway/exceptions";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import {
  Action,
  ActionType,
  EligibilityErrorTypes,
  EligibilityForPersonType,
  EligibilityStatus,
  SummaryContent,
} from "@src/services/eligibility-api/types";
import { Cohort, Content, Heading, Introduction } from "@src/services/eligibility-api/types";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const ELIGIBILITY_CONTENT_INTRO_TEXT = "This is because you:" as Introduction;

const log: Logger = logger.child({ module: "eligibility-filter-service" });

const getEligibilityForPerson = async (
  vaccineType: VaccineTypes,
  nhsNumber: string,
): Promise<EligibilityForPersonType> => {
  try {
    const eligibilityApiResponse = await fetchEligibilityContent(nhsNumber);

    const suggestionForVaccine = eligibilityApiResponse.processedSuggestions.find(
      ({ condition }) => condition === vaccineType,
    );

    if (!suggestionForVaccine) {
      log.error(
        `EliD response validation error: Processed suggestion not found for vaccine type ${vaccineType}, NHS number ${nhsNumber}`,
      );
      return {
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
      };
    }

    let summary: SummaryContent | undefined;
    if (suggestionForVaccine.eligibilityCohorts.length > 0) {
      summary = {
        heading: suggestionForVaccine.statusText as Heading,
        introduction: ELIGIBILITY_CONTENT_INTRO_TEXT,
        cohorts: _extractAllCohortText(suggestionForVaccine),
      };
    }

    const actions: Action[] = _generateActions(suggestionForVaccine);

    return {
      eligibility: {
        status: _getStatus(suggestionForVaccine),
        content: { summary, actions },
      },
      eligibilityError: undefined,
    };
  } catch (error: unknown) {
    if (error instanceof EligibilityApiError) {
      return {
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
      };
    } else {
      log.error(error, "An unknown error occurred");
      return {
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.UNKNOWN,
      };
    }
  }
};

const _extractAllCohortText = (suggestion: ProcessedSuggestion): Cohort[] => {
  return suggestion.eligibilityCohorts.map((cohort: EligibilityCohort) => cohort.cohortText) as Cohort[];
};

const _getStatus = (suggestion: ProcessedSuggestion): EligibilityStatus => {
  switch (suggestion.status) {
    case "NotEligible":
      return EligibilityStatus.NOT_ELIGIBLE;
    case "NotActionable":
      return EligibilityStatus.ALREADY_VACCINATED;
    case "Actionable":
      return EligibilityStatus.ACTIONABLE;
  }
};

const _generateActions = (suggestion: ProcessedSuggestion): Action[] => {
  return suggestion.actions.flatMap((action) => {
    if (action.actionType === "InfoText") {
      return [
        {
          type: ActionType.paragraph,
          content: action.description as Content,
        },
      ];
    }
    return []; // Empty array return means it skips this entry
  });
};

export { getEligibilityForPerson, _extractAllCohortText, _getStatus, _generateActions };
