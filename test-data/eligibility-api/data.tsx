import {
  EligibilityApiResponse,
  EligibilityContent,
  EligibilityForPerson,
  EligibilityStatus
} from "@src/services/eligibility-api/types";

export const mockEligibilityResponse: EligibilityApiResponse = {
    "responseId": "1a233ba5-e1eb-4080-a086-2962f6fc3473",
    "meta": {
    "lastUpdated": "2025-02-12T16:11:22Z"
  },
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
  "responseId": "1a233ba5-e1eb-4080-a086-2962f6fc3473",
  "meta": {
    "lastUpdated": "2025-02-12T16:11:22Z"
  },
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
