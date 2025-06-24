// Downstream API
export type EligibilityApiResponse = {
  processedSuggestions: ProcessedSuggestion[];
};

export type ProcessedSuggestion = {
  condition: Condition;
  status: Status;
  statusText: string;
  eligibilityCohorts: EligibilityCohort[];
  actions: ActionFromApi[];
};

export type Condition = "RSV";
export type Status = "NotEligible" | "NotActionable" | "Actionable";

export type EligibilityCohort = {
  cohortCode: string;
  cohortText: string;
  cohortStatus: Status;
};

export type ActionFromApi = {
  actionType: ActionType;
  actionCode: ActionCode;
  description: string;
};

export type ActionType = "InfoText" | "CardWithText" | "ButtonWithAuthLink";
export type ActionCode = "HealthcareProInfo";
