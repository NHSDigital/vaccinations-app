import {
  EligibilityContent,
  EligibilityForPerson,
  EligibilityStatus
} from "@src/services/eligibility-api/types";
import { EligibilityApiResponse } from "@src/services/eligibility-api/api-types";

export const mockEligibilityResponse: EligibilityApiResponse = {
    "processedSuggestions": [
    {
      "condition": "RSV",
      "status": "NotEligible",
      "statusText": "We do not believe you should have this vaccine",
      "eligibilityCohorts": [
        {
          "cohortCode": "rsv_age_rolling",
          "cohortText": "You are not aged 75 to 79 years old.",
          "cohortStatus": "NotEligible"
        },
        {
          "cohortCode": "rsv_age_catchup",
          "cohortText": "You did not turn 80 between 2nd September 2024 and 31st August 2025",
          "cohortStatus": "NotEligible"
        }
      ]
    }
  ]
};

export const mockEligibilityResponseWithoutCohorts: EligibilityApiResponse = {
  "processedSuggestions": [
    {
      "condition": "RSV",
      "status": "NotEligible",
      "statusText": "We do not believe you should have this vaccine",
      "eligibilityCohorts": []
    }
  ]
};

export const mockEligibilityContent: EligibilityContent = {
  status: {
    heading: "We do not believe you should have this vaccine",
    introduction: "This is because you:",
    points: ["You are not aged 75 to 79 years old.", "You did not turn 80 between 2nd September 2024 and 31st August 2025"],
  }
};

export const mockEligibilityForPerson: EligibilityForPerson = {
  eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
  eligibilityContent: mockEligibilityContent,
  eligibilityError: undefined
};

export const mockEligibilityWithNoContent: EligibilityForPerson = {
  eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
  eligibilityContent: undefined,
  eligibilityError: undefined
};
