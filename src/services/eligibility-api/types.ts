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
