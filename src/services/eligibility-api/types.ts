export enum EligibilityStatus {
  NOT_ELIGIBLE = "NotEligible",
  ALREADY_VACCINATED = "AlreadyVaccinated",
  ACTIONABLE = "Actionable",
  NOT_ACTIONABLE_MANAGED_SETTING = "NotActionableManagedSetting",
  NOT_ACTIONABLE_OUT_OF_AREA = "NotActionableOutOfArea",
  ELIGIBLE_BOOKABLE = "EligibleBookable",
  ELIGIBLE_HAVE_NBS_BOOKING = "EligibleHaveNBSBooking",
  ELIGIBLE_HAVE_PROVIDER_BOOKING = "EligibleHaveProviderBooking",
}

export type EligibilityContent = {
  summary: SummaryContent | undefined;
  actions: Action[];
};

export type SummaryContent = {
  heading: string;
  introduction: string;
  cohorts: string[];
};

export type Action = {
  type: "paragraph" | "card";
  content: string;
};

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
