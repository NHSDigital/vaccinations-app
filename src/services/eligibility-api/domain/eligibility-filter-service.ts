import { VaccineTypes } from "@src/models/vaccine";
import {
  Action,
  EligibilityErrorTypes,
  EligibilityForPersonType,
  EligibilityStatus,
  SummaryContent,
} from "@src/services/eligibility-api/types";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { Logger } from "pino";
import { logger } from "@src/utils/logger";
import {
  ActionFromApi,
  EligibilityApiResponse,
  EligibilityCohort,
  ProcessedSuggestion,
} from "@src/services/eligibility-api/api-types";

const ELIGIBILITY_CONTENT_INTRO_TEXT: string = "This is because you:";

const log: Logger = logger.child({ module: "eligibility-filter-service" });

const getEligibilityForPerson = async (
  vaccineType: VaccineTypes,
  nhsNumber: string,
): Promise<EligibilityForPersonType> => {
  try {
    const eligibilityApiResponse: EligibilityApiResponse =
      await fetchEligibilityContent(nhsNumber);

    const suggestionForVaccine: ProcessedSuggestion | undefined =
      eligibilityApiResponse.processedSuggestions.find(
        ({ condition }: ProcessedSuggestion) => condition === vaccineType,
      );

    if (!suggestionForVaccine) {
      log.error(
        `EliD response validation error: Processed suggestion not found for ${vaccineType}`,
      );
      return {
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
      };
    }

    let summary: SummaryContent | undefined;

    if (!suggestionForVaccine.eligibilityCohorts) {
      log.error(
        "EliD response validation error: Missing eligibilityCohorts element",
      );
    } else if (suggestionForVaccine.eligibilityCohorts.length > 0) {
      summary = {
        heading: suggestionForVaccine.statusText,
        introduction: ELIGIBILITY_CONTENT_INTRO_TEXT,
        cohorts: _extractAllCohortText(suggestionForVaccine),
      };
    }

    const actions: Action[] = _generateActions(suggestionForVaccine);

    return {
      eligibility: {
        status: _getStatus(suggestionForVaccine),
        content: {
          summary: summary,
          actions,
        },
      },
      eligibilityError: undefined,
    };
  } catch (error) {
    // TODO: Error handling for Eligibility API
    log.error(error, "Error getting eligibility");
    return {
      eligibility: undefined,
      eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
    };
  }
};

const _extractAllCohortText = (suggestion: ProcessedSuggestion): string[] => {
  return suggestion.eligibilityCohorts.map(
    (cohort: EligibilityCohort) => cohort.cohortText,
  );
};

const _getStatus = (suggestion: ProcessedSuggestion): EligibilityStatus => {
  if (suggestion.status === "NotEligible") {
    return EligibilityStatus.NOT_ELIGIBLE;
  }
  if (suggestion.status === "NotActionable") {
    return EligibilityStatus.ALREADY_VACCINATED; // WIP
  }
  if (suggestion.status === "Actionable") {
    return EligibilityStatus.ACTIONABLE; // WIP
  }
  // TODO: default case if ELID returns unknown status type
  throw new Error("not yet implemented");
};

const _generateActions = (suggestion: ProcessedSuggestion): Action[] => {
  if (!suggestion.actions) {
    log.warn("Missing actions array");
    return [];
  }

  const content: Action[] = suggestion.actions.flatMap(
    (action: ActionFromApi) => {
      if (action.actionType === "InfoText") {
        return [
          {
            type: "paragraph",
            content: action.description,
          },
        ];
      } else {
        return []; // Empty array return means it skips this entry
      }
    },
  );

  return content;
};

export {
  getEligibilityForPerson,
  _extractAllCohortText,
  _getStatus,
  _generateActions,
};
