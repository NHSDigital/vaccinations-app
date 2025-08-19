import { NhsNumber, VaccineTypes } from "@src/models/vaccine";
import {
  EligibilityApiResponse,
  EligibilityCohort,
  ProcessedSuggestion,
  Action as ResponseAction,
  SuitabilityRule as ResponseSuitabilityRule,
} from "@src/services/eligibility-api/api-types";
import { EligibilityApiError } from "@src/services/eligibility-api/gateway/exceptions";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import {
  Action,
  ActionDisplayType,
  ButtonUrl,
  Cohort,
  Content,
  EligibilityErrorTypes,
  EligibilityForPersonType,
  EligibilityStatus,
  Heading,
  Introduction,
  Label,
  RuleDisplayType,
  SuitabilityRule,
  SummaryContent,
} from "@src/services/eligibility-api/types";
import { ApimAuthError } from "@src/utils/auth/apim/exceptions";
import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { Logger } from "pino";

const ELIGIBILITY_CONTENT_INTRO_TEXT: string = "This is because you:";

const log: Logger = logger.child({ module: "eligibility-filter-service" });
const GetEligibilityPerformanceMarker = "get-eligibility";

const getEligibilityForPerson = async (
  vaccineType: VaccineTypes,
  nhsNumber: NhsNumber,
): Promise<EligibilityForPersonType> => {
  try {
    profilePerformanceStart(GetEligibilityPerformanceMarker);

    const eligibilityApiResponse: EligibilityApiResponse = await fetchEligibilityContent(nhsNumber);

    const suggestionForVaccine: ProcessedSuggestion | undefined = eligibilityApiResponse.processedSuggestions.find(
      ({ condition }: ProcessedSuggestion) => condition === vaccineType,
    );

    if (!suggestionForVaccine) {
      log.error(
        { context: { nhsNumber, vaccineType } },
        "EliD response validation error: Processed suggestion not found",
      );
      return {
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
      };
    }

    let summary: SummaryContent | undefined;

    if (suggestionForVaccine.eligibilityCohorts.length) {
      summary = {
        heading: suggestionForVaccine.statusText as Heading,
        introduction: ELIGIBILITY_CONTENT_INTRO_TEXT as Introduction,
        cohorts: _extractAllCohortText(suggestionForVaccine) as Cohort[],
      };
    }

    const actions: Action[] = _generateActions(suggestionForVaccine, nhsNumber);
    const suitabilityRules: SuitabilityRule[] = _generateSuitabilityRules(suggestionForVaccine, nhsNumber);

    profilePerformanceEnd(GetEligibilityPerformanceMarker);

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
    if (error instanceof EligibilityApiError || error instanceof ApimAuthError) {
      return {
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
      };
    } else {
      log.error({ context: { nhsNumber, vaccineType }, error }, "Unexpected error");
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
    return EligibilityStatus.NOT_ACTIONABLE;
  }
  if (suggestion.status === "Actionable") {
    return EligibilityStatus.ACTIONABLE;
  }
  log.error({ context: { nhsNumber, status: suggestion.status } }, "EligibilityStatus not yet implemented.");
  throw new Error(`${suggestion.status} not yet implemented.`);
};

const _generateActions = (suggestion: ProcessedSuggestion, nhsNumber: NhsNumber): Action[] => {
  const content: Action[] = suggestion.actions.flatMap((action: ResponseAction): Action[] => {
    switch (action.actionType) {
      case "InfoText": {
        return [
          {
            type: ActionDisplayType.infotext,
            content: action.description as Content,
            button: undefined,
          },
        ];
      }
      case "CardWithText": {
        return [
          {
            type: ActionDisplayType.card,
            content: action.description as Content,
            button: undefined,
          },
        ];
      }
      case "ButtonWithAuthLink": {
        return [
          action.url && action.urlLabel
            ? {
                type: ActionDisplayType.authButton,
                content: action.description as Content,
                button: { label: action.urlLabel as Label, url: new URL(action.url) as ButtonUrl },
              }
            : {
                type: ActionDisplayType.authButton,
                content: action.description as Content,
                button: undefined,
              },
        ];
      }
      default: {
        log.warn({ context: { nhsNumber, actionType: action.actionType } }, "Action type not yet implemented.");
        return [
          {
            type: ActionDisplayType.infotext,
            content: action.description as Content,
            button: undefined,
          },
        ];
      }
    }
  });

  return content;
};

const _generateSuitabilityRules = (suggestion: ProcessedSuggestion, nhsNumber: NhsNumber): SuitabilityRule[] => {
  const content: SuitabilityRule[] = suggestion.suitabilityRules.flatMap(
    (rule: ResponseSuitabilityRule): SuitabilityRule[] => {
      switch (rule.ruleCode) {
        case "AlreadyVaccinated": {
          return [{ type: RuleDisplayType.card, content: rule.ruleText as Content }];
        }
        case "OtherSetting": {
          return [{ type: RuleDisplayType.infotext, content: rule.ruleText as Content }];
        }
        default: {
          log.warn({ context: { nhsNumber, ruleCode: rule.ruleCode } }, "SuitabilityRule code not yet implemented.");
          return [{ type: RuleDisplayType.infotext, content: rule.ruleText as Content }];
        }
      }
    },
  );

  return content;
};

export { getEligibilityForPerson, _extractAllCohortText, _getStatus, _generateActions, _generateSuitabilityRules };
