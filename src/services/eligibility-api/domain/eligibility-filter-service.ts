import { VaccineTypes } from "@src/models/vaccine";
import {
  Action,
  EligibilityContent,
  EligibilityErrorTypes,
  EligibilityForPerson,
  EligibilityStatus,
} from "@src/services/eligibility-api/types";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { Logger } from "pino";
import { logger } from "@src/utils/logger";
import { Session } from "next-auth";
import { auth } from "@project/auth";
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
): Promise<EligibilityForPerson> => {
  const session: Session | null = await auth();

  if (!session) {
    return {
      eligibility: {
        status: undefined,
        content: undefined,
      },
      eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
    };
  }

  const eligibilityApiResponse: EligibilityApiResponse | undefined =
    await fetchEligibilityContent(session.user.nhs_number);

  // TODO: Error handling for Eligibility API
  if (!eligibilityApiResponse) {
    return {
      eligibility: {
        status: undefined,
        content: undefined,
      },
      eligibilityError: undefined,
    };
  }

  const suggestion: ProcessedSuggestion | undefined =
    eligibilityApiResponse.processedSuggestions.find(
      ({ condition }: ProcessedSuggestion) => condition === vaccineType,
    );

  let cohortText: string[] | undefined;
  let heading: string = "";
  let status: EligibilityStatus | undefined;
  let actions: Action[] = [];

  if (suggestion) {
    status = _getStatus(suggestion);
    heading = suggestion.statusText;
    cohortText = _extractAllCohortText(suggestion);
    actions = _generateActions(suggestion);
  } else {
    log.error(
      `Error accessing processedSuggestion from Eligibility API, no suggestion for ${vaccineType} given.`,
    );
  }

  const eligibilityContent: EligibilityContent | undefined = cohortText
    ? {
        status: {
          heading: heading,
          introduction: ELIGIBILITY_CONTENT_INTRO_TEXT,
          points: cohortText,
        },
        actions,
      }
    : undefined;

  return {
    eligibility: {
      status: status,
      content: eligibilityContent,
    },
    eligibilityError: undefined,
  };
};

const _extractAllCohortText = (
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

const _getStatus = (
  suggestion: ProcessedSuggestion,
): EligibilityStatus | undefined => {
  if (suggestion.status === "NotEligible") {
    return EligibilityStatus.NOT_ELIGIBLE;
  }
  if (suggestion.status === "NotActionable") {
    return EligibilityStatus.ALREADY_VACCINATED; // WIP
  }
  if (suggestion.status === "Actionable") {
    return EligibilityStatus.ACTIONABLE; // WIP
  }
};

const _generateActions = (suggestion: ProcessedSuggestion): Action[] => {
  if (!suggestion.actions) {
    log.warn("Missing actions array");
    return [];
  }

  // WIP
  const filteredActions: ActionFromApi[] = suggestion.actions.filter(
    (action) => action.actionType === "InfoText",
  );
  const content: Action[] = filteredActions.map((action) => ({
    type: "paragraph",
    content: action.description,
  }));

  return content;
};

export {
  getEligibilityForPerson,
  _extractAllCohortText,
  _getStatus,
  _generateActions,
};
