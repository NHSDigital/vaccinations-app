import {
  EligibilityContent,
  EligibilityForPerson,
  EligibilityStatus
} from "@src/services/eligibility-api/types";

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
