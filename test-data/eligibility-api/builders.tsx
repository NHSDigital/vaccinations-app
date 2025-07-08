import {
  ActionFromApi,
  EligibilityApiResponse,
  EligibilityCohort,
  ProcessedSuggestion,
} from "@src/services/eligibility-api/api-types";
import {
  Action,
  ActionType,
  Cohort,
  Content,
  Eligibility,
  EligibilityContent,
  EligibilityForPersonType,
  EligibilityStatus,
  Heading,
  Introduction,
  SummaryContent,
} from "@src/services/eligibility-api/types";
import { createTypeBuilder, randomString, randomValue } from "@test-data/meta-builder";

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
  return createTypeBuilder<ActionFromApi>({
    actionType: randomValue(["ButtonWithAuthLink", "CardWithText", "InfoText"]),
    actionCode: randomValue(["HealthcareProInfo"]),
    description: randomString(10),
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
    type: randomValue(Object.values(ActionType)),
    content: randomString(10) as Content,
  });
}
