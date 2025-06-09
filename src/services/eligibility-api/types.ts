export enum EligibilityStatus {
  NOT_ELIGIBLE,
  ALREADY_VACCINATED,
  NOT_ACTIONABLE_MANAGED_SETTING,
  ELIGIBLE_BOOKABLE,
  ELIGIBLE_HAVE_NBS_BOOKING,
  ELIGIBLE_HAVE_PROVIDER_BOOKING,
  NOT_ACTIONABLE_OUT_OF_AREA,
}

export enum EligibilityErrorTypes {
  ELIGIBILITY_LOADING_ERROR,
}

export type GetEligibilityForPersonResponse = {
  eligibilityStatus: EligibilityStatus;
  styledEligibilityContent?: StyledEligibilityContent;
  eligibilityError?: EligibilityErrorTypes;
};

export type StyledEligibilityContent = {
  heading: string;
  content: string;
};

// Downstream API
export type EligibilityApiResponse = {
  responseId: string;
  meta: LastUpdated;
  processedSuggestions: ProcessedSuggestion[];
};

type LastUpdated = {
  lastUpdated: string;
};

type ProcessedSuggestion = {
  condition: string;
  status: Status;
  statusText: string;
  eligibilityCohorts: EligibilityCohort[];
};

type Status = "NotEligible" | "NotActionable" | "Actionable";

type EligibilityCohort = {
  cohortCode: string;
  cohortText: string;
  cohortStatus: string;
};
