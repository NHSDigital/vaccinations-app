export enum EligibilityStatus {
  NOT_ELIGIBLE = "NotEligible",
  ALREADY_VACCINATED = "AlreadyVaccinated",
  ACTIONABLE = "Actionable",
  NOT_ACTIONABLE_MANAGED_SETTING = "NotActionableManagedSetting",
  NOT_ACTIONABLE_OUT_OF_AREA = "NotActionableOutOfArea",
  ELIGIBLE_BOOKABLE = "EligibleBookable",
  ELIGIBLE_HAVE_NBS_BOOKING = "EligibleHaveNBSBooking",
  ELIGIBLE_HAVE_PROVIDER_BOOKING = "EligibleHaveProviderBooking",
  EMPTY = "Empty",
}

export type EligibilityContent = {
  status: StatusContent;
};

type StatusContent = {
  heading: string;
  introduction: string;
  points: string[];
};

export enum EligibilityErrorTypes {
  ELIGIBILITY_LOADING_ERROR,
}

export type EligibilityForPerson = {
  eligibilityStatus: EligibilityStatus;
  eligibilityContent?: EligibilityContent;
  eligibilityError?: EligibilityErrorTypes;
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
