export enum EligibilityStatus {
  NOT_ELIGIBLE = "NotEligible",
  ALREADY_VACCINATED = "AlreadyVaccinated",
  ACTIONABLE = "Actionable",
  NOT_ACTIONABLE_MANAGED_SETTING = "NotActionableManagedSetting",
  NOT_ACTIONABLE_OUT_OF_AREA = "NotActionableOutOfArea",
  ELIGIBLE_BOOKABLE = "EligibleBookable",
  ELIGIBLE_HAVE_NBS_BOOKING = "EligibleHaveNBSBooking",
  ELIGIBLE_HAVE_PROVIDER_BOOKING = "EligibleHaveProviderBooking",
  EMPTY = "Empty", // TODO: Should go away once we have all these implemented.
}

export type EligibilityContent = {
  status: StatusContent;
};

export type StatusContent = {
  heading: string;
  introduction: string;
  points: string[];
};

export enum EligibilityErrorTypes {
  ELIGIBILITY_LOADING_ERROR = "LOADING",
}

export type EligibilityForPerson = {
  eligibilityStatus: EligibilityStatus;
  eligibilityContent?: EligibilityContent;
  eligibilityError?: EligibilityErrorTypes;
};
