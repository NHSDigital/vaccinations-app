// Downstream API
export type EligibilityApiResponse = {
  processedSuggestions: ProcessedSuggestion[];
};

export type ProcessedSuggestion = {
  condition: string;
  status: Status;
  statusText: string;
  eligibilityCohorts: EligibilityCohort[];
};

type Status = "NotEligible" | "NotActionable" | "Actionable";

export type EligibilityCohort = {
  cohortCode: string;
  cohortText: string;
  cohortStatus: string;
};
