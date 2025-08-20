import { Brand } from "@project/src/utils/types";

export type Heading = Brand<string, "Heading">;
export type Introduction = Brand<string, "Introduction">;
export type Cohort = Brand<string, "Cohort">;
export type Content = Brand<string, "Content">;
export type Label = Brand<string, "Label">;
export type ButtonUrl = Brand<URL, "ButtonUrl">;

export enum EligibilityStatus {
  NOT_ELIGIBLE = "NotEligible",
  NOT_ACTIONABLE = "NotActionable",
  ACTIONABLE = "Actionable",
}

export type EligibilityContent = {
  summary: SummaryContent | undefined;
  actions: Action[];
  suitabilityRules: SuitabilityRule[];
};

export type SummaryContent = {
  heading: Heading;
  introduction: Introduction;
  cohorts: Cohort[];
};

export enum ActionDisplayType {
  infotext = "infotext",
  card = "card",
  buttonWithCard = "buttonWithCard",
  buttonWithInfo = "buttonWithInfo",
  actionLinkWithInfo = "actionLinkWithInfo",
}

export type ActionWithoutButton = {
  type: ActionDisplayType;
  content: Content;
  button: undefined;
  delineator: boolean;
};

export type ActionWithButton = {
  type: ActionDisplayType;
  content: Content;
  button: Button;
  delineator: boolean;
};

export type Button = { label: Label; url: ButtonUrl };

export type Action = ActionWithoutButton | ActionWithButton;

export enum RuleDisplayType {
  card = "card",
  infotext = "infotext",
}

export type SuitabilityRule = { type: RuleDisplayType; content: Content; delineator: boolean };

export enum EligibilityErrorTypes {
  ELIGIBILITY_LOADING_ERROR = "ELIGIBILITY_LOADING",
  UNKNOWN = "UNKNOWN",
}

export type EligibilityForPersonType = EligibilityForPerson | EligibilityForPersonError;

type EligibilityForPerson = {
  eligibility: Eligibility;
  eligibilityError: undefined;
};

type EligibilityForPersonError = {
  eligibility: undefined;
  eligibilityError: EligibilityErrorTypes;
};

export type Eligibility = {
  status: EligibilityStatus;
  content: EligibilityContent;
};
