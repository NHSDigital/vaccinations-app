import {
  EligibilityApiResponse,
  EligibilityCohort,
  ProcessedSuggestion
} from "@src/services/eligibility-api/api-types";
import {
  EligibilityContent,
  EligibilityErrorTypes,
  EligibilityForPerson,
  EligibilityStatus,
  StatusContent
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
  });
}

export function eligibilityCohortBuilder() {
  return createTypeBuilder<EligibilityCohort>({
    cohortCode: randomString(10),
    cohortText: randomString(10),
    cohortStatus: randomValue(["NotEligible", "NotActionable", "Actionable"]),
  });
}

export function eligibilityForPersonBuilder() {
  return createTypeBuilder<EligibilityForPerson>({
    eligibilityStatus: randomValue(Object.values(EligibilityStatus)),
    eligibilityContent: eligibilityContentBuilder().build(),
    eligibilityError: randomValue(Object.values(EligibilityErrorTypes))
  });
}

export function eligibilityContentBuilder() {
  return createTypeBuilder<EligibilityContent>({ status: statusContentBuilder().build() });
}

export function statusContentBuilder() {
  return createTypeBuilder<StatusContent>({
    heading: randomString(10),
    introduction: randomString(10),
    points: [randomString(10), randomString(10)]
  });
}
