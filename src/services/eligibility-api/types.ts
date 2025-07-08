type Brand<T, B extends string> = T & { __brand: B };

export type Heading = Brand<string, "Heading">;
export type Introduction = Brand<string, "Introduction">;
export type Cohort = Brand<string, "Cohort">;
export type Content = Brand<string, "Content">;

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
  heading: Heading;
  introduction: Introduction;
  cohorts: Cohort[];
};

export enum ActionType {
  paragraph = "paragraph",
  card = "card",
}

export type Action = {
  type: ActionType;
  content: Content;
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
