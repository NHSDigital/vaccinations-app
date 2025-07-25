// Downstream API
export type EligibilityApiResponse = {
  processedSuggestions: ProcessedSuggestion[];
};

export type ProcessedSuggestion = {
  condition: Condition;
  status: Status;
  statusText: string;
  eligibilityCohorts: EligibilityCohort[];
  actions: Action[];
  suitabilityRules: SuitabilityRule[];
};

export type Condition = "RSV";
export type Status = "NotEligible" | "NotActionable" | "Actionable";

export type EligibilityCohort = {
  cohortCode: string;
  cohortText: string;
  cohortStatus: Status;
};

export type Action = {
  actionType: ActionType;
  description: string;
  urlLink: URL | undefined;
  urlLabel: string | undefined;
};

export type SuitabilityRule = {
  ruleCode: RuleCode;
  ruleText: string;
};

export type ActionType = "InfoText" | "CardWithText" | "ButtonWithAuthLink";
export type RuleCode = "AlreadyVaccinated" | "NotAvailable" | "NotYetDue" | "TooClose" | "OtherSetting";
