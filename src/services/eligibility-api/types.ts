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
  status: StatusContent;
  actions: Action[];
};

export type StatusContent = {
  heading: string;
  introduction: string;
  points: string[];
};

export type Action = {
  type: "paragraph" | "card";
  content: string;
};

export enum EligibilityErrorTypes {
  ELIGIBILITY_LOADING_ERROR = "LOADING",
}

export type EligibilityForPerson = {
  eligibilityStatus?: EligibilityStatus;
  eligibilityContent?: EligibilityContent;
  eligibilityError?: EligibilityErrorTypes;
};
