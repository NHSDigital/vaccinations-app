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
  suitabilityRules: SuitabilityRuleFromApi[];
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
  urlLink: string;
  urlLabel: string;
};

export type SuitabilityRuleFromApi = {
  ruleCode: RuleCode;
  ruleText: string;
};

export type ActionType = "InfoText" | "CardWithText" | "ButtonWithAuthLink";
export type RuleCode = "AlreadyVaccinated" | "NotAvailable" | "NotYetDue" | "TooClose" | "OtherSetting";
export type ActionCode = "HealthcareProInfo";
