import { NhsNumber, VaccineTypes } from "@src/models/vaccine";
import {
  ActionFromApi,
  EligibilityApiResponse,
  EligibilityCohort,
  ProcessedSuggestion,
  SuitabilityRuleFromApi,
} from "@src/services/eligibility-api/api-types";
import { EligibilityApiHttpStatusError } from "@src/services/eligibility-api/gateway/exceptions";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import {
  Action,
  ActionType,
  ButtonUrl,
  EligibilityErrorTypes,
  EligibilityForPersonType,
  EligibilityStatus,
  Label,
  RuleType,
  SuitabilityRule,
  SummaryContent,
} from "@src/services/eligibility-api/types";
import { Cohort, Content, Heading, Introduction } from "@src/services/eligibility-api/types";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const ELIGIBILITY_CONTENT_INTRO_TEXT: string = "This is because you:";

const log: Logger = logger.child({ module: "eligibility-filter-service" });

const getEligibilityForPerson = async (
  vaccineType: VaccineTypes,
  nhsNumber: NhsNumber,
): Promise<EligibilityForPersonType> => {
  try {
    const eligibilityApiResponse: EligibilityApiResponse = await fetchEligibilityContent(nhsNumber);

    const suggestionForVaccine: ProcessedSuggestion | undefined = eligibilityApiResponse.processedSuggestions.find(
      ({ condition }: ProcessedSuggestion) => condition === vaccineType,
    );

    if (!suggestionForVaccine) {
      log.error({ nhsNumber, vaccineType }, "EliD response validation error: Processed suggestion not found");
      return {
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
      };
    }

    let summary: SummaryContent | undefined;

    if (!suggestionForVaccine.eligibilityCohorts) {
      log.error({ nhsNumber, vaccineType }, "EliD response validation error: Missing eligibilityCohorts element");
    } else if (suggestionForVaccine.eligibilityCohorts.length > 0) {
      summary = {
        heading: suggestionForVaccine.statusText as Heading,
        introduction: ELIGIBILITY_CONTENT_INTRO_TEXT as Introduction,
        cohorts: _extractAllCohortText(suggestionForVaccine) as Cohort[],
      };
    }

    const actions: Action[] = _generateActions(suggestionForVaccine, vaccineType, nhsNumber);
    const suitabilityRules: SuitabilityRule[] = _generateSuitabilityRules(suggestionForVaccine, vaccineType, nhsNumber);

    return {
      eligibility: {
        status: _getStatus(suggestionForVaccine, nhsNumber),
        content: {
          summary: summary,
          actions,
          suitabilityRules,
        },
      },
      eligibilityError: undefined,
    };
  } catch (error: unknown) {
    if (error instanceof EligibilityApiHttpStatusError) {
      return {
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
      };
    } else {
      log.error({ nhsNumber, vaccineType, error }, "Unexpected error");
      return {
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.UNKNOWN,
      };
    }
  }
};

const _extractAllCohortText = (suggestion: ProcessedSuggestion): string[] => {
  return suggestion.eligibilityCohorts.map((cohort: EligibilityCohort) => cohort.cohortText);
};

const _getStatus = (suggestion: ProcessedSuggestion, nhsNumber: NhsNumber): EligibilityStatus => {
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
  log.error({ nhsNumber }, `${suggestion.status} not yet implemented.`);
  throw new Error(`${suggestion.status} not yet implemented.`);
};

const _generateActions = (
  suggestion: ProcessedSuggestion,
  vaccineType: VaccineTypes,
  nhsNumber: NhsNumber,
): Action[] => {
  if (!suggestion.actions) {
    log.warn({ nhsNumber, vaccineType }, "Missing actions array");
    return [];
  }

  const content: Action[] = suggestion.actions.flatMap((action: ActionFromApi): Action[] => {
    switch (action.actionType) {
      case "InfoText": {
        return [
          {
            type: ActionType.paragraph,
            content: action.description as Content,
            button: undefined,
          },
        ];
      }
      case "CardWithText": {
        return [
          {
            type: ActionType.card,
            content: action.description as Content,
            button: undefined,
          },
        ];
      }
      case "ButtonWithAuthLink": {
        return [
          {
            type: ActionType.authButton,
            content: action.description as Content,
            button: { label: action.urlLabel as Label, url: new URL(action.urlLink) as ButtonUrl },
          },
        ];
      }
      default: {
        log.error({ nhsNumber }, `Action type ${action.actionType} not yet implemented.`);
        throw new Error(`Action type ${action.actionType} not yet implemented.`);
      }
    }
  });

  return content;
};

const _generateSuitabilityRules = (
  suggestion: ProcessedSuggestion,
  vaccineType: VaccineTypes,
  nhsNumber: NhsNumber,
): SuitabilityRule[] => {
  if (!suggestion.suitabilityRules) {
    log.warn({ nhsNumber, vaccineType }, "Missing suitabilityRules array");
    return [];
  }

  const content: SuitabilityRule[] = suggestion.suitabilityRules.flatMap(
    (rule: SuitabilityRuleFromApi): SuitabilityRule[] => {
      switch (rule.ruleCode) {
        case "AlreadyVaccinated": {
          return [{ type: RuleType.card, content: rule.ruleText as Content }];
        }
        default: {
          log.error({ nhsNumber }, `SuitabilityRule code ${rule.ruleCode} not yet implemented.`);
          throw new Error(`SuitabilityRule code ${rule.ruleCode} not yet implemented.`);
        }
      }
    },
  );

  return content;
};

export { getEligibilityForPerson, _extractAllCohortText, _getStatus, _generateActions, _generateSuitabilityRules };
