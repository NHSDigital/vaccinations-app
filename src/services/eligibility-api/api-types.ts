// Downstream API
export type EligibilityApiResponse = {
  processedSuggestions: ProcessedSuggestion[];
};

export type ProcessedSuggestion = {
  condition: Condition;
  status: Status;
  statusText: string;
  eligibilityCohorts: EligibilityCohort[];
};

export type Condition = "COVID" | "FLU" | "MMR" | "RSV";
export type Status = "NotEligible" | "NotActionable" | "Actionable";

export type EligibilityCohort = {
  cohortCode: string;
  cohortText: string;
  cohortStatus: Status;
};
