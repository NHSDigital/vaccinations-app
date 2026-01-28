import {
  EligibilityApiResponse,
  EligibilityCohort,
  ProcessedSuggestion,
  Action as ResponseAction,
  SuitabilityRule as ResponseSuitabilityRule,
} from "@src/services/eligibility-api/api-types";
import {
  Action,
  ActionDisplayType,
  Button,
  ButtonUrl,
  Cohort,
  Content,
  Eligibility,
  EligibilityContent,
  EligibilityForPersonType,
  EligibilityStatus,
  Heading,
  Introduction,
  Label,
  RuleDisplayType,
  SuitabilityRule,
  SummaryContent,
} from "@src/services/eligibility-api/types";
import { createTypeBuilder, randomBoolean, randomString, randomURL, randomValue } from "@test-data/meta-builder";

export function eligibilityApiResponseBuilder() {
  return createTypeBuilder<EligibilityApiResponse>({
    processedSuggestions: [processedSuggestionBuilder().build(), processedSuggestionBuilder().build()],
  });
}

export function processedSuggestionBuilder() {
  return createTypeBuilder<ProcessedSuggestion>({
    condition: randomValue(["RSV"]),
    status: randomValue(["NotEligible", "NotActionable", "Actionable"]),
    statusText: randomString(10),
    eligibilityCohorts: [eligibilityCohortBuilder().build(), eligibilityCohortBuilder().build()],
    actions: [actionFromApiBuilder().build(), actionFromApiBuilder().build()],
    suitabilityRules: [suitabilityRuleFromApiBuilder().build(), suitabilityRuleFromApiBuilder().build()],
  });
}

export function eligibilityCohortBuilder() {
  return createTypeBuilder<EligibilityCohort>({
    cohortCode: randomString(10),
    cohortText: randomString(10),
    cohortStatus: randomValue(["NotEligible", "NotActionable", "Actionable"]),
  });
}

export function actionFromApiBuilder() {
  return createTypeBuilder<ResponseAction>({
    actionType: randomValue(["ButtonWithAuthLink", "CardWithText", "InfoText"]),
    description: randomString(10),
    url: randomURL(),
    urlLabel: randomString(10),
  });
}

export function suitabilityRuleFromApiBuilder() {
  return createTypeBuilder<ResponseSuitabilityRule>({
    ruleCode: randomValue(["AlreadyVaccinated", "NotAvailable", "NotYetDue", "TooClose", "OtherSetting"]),
    ruleText: randomString(10),
  });
}

export function eligibilityForPersonBuilder() {
  return createTypeBuilder<EligibilityForPersonType>({
    eligibility: eligibilityBuilder().build(),
    eligibilityError: undefined,
  });
}

export function eligibilityBuilder() {
  return createTypeBuilder<Eligibility>({
    status: randomValue(Object.values(EligibilityStatus)),
    content: eligibilityContentBuilder().build(),
  });
}

export function eligibilityContentBuilder() {
  return createTypeBuilder<EligibilityContent>({
    summary: summaryContentBuilder().build(),
    actions: [actionBuilder().build(), actionBuilder().build()],
    suitabilityRules: [suitabilityRuleBuilder().build(), suitabilityRuleBuilder().build()],
  });
}

export function summaryContentBuilder() {
  return createTypeBuilder<SummaryContent>({
    heading: randomString(10) as Heading,
    introduction: randomString(10) as Introduction,
    cohorts: [randomString(10), randomString(10)] as Cohort[],
  });
}

export function actionBuilder() {
  return createTypeBuilder<Action>({
    type: randomValue(Object.values(ActionDisplayType)),
    content: randomString(10) as Content,
    button: buttonBuilder().build(),
    moreInfo: randomString(10) as Content,
  });
}

export function buttonBuilder() {
  return createTypeBuilder<Button>({
    label: randomString(10) as Label,
    url: randomURL() as ButtonUrl,
  });
}

export function suitabilityRuleBuilder() {
  return createTypeBuilder<SuitabilityRule>({
    type: randomValue(Object.values(RuleDisplayType)),
    content: randomString(10) as Content,
    delineator: randomBoolean(),
  });
}
