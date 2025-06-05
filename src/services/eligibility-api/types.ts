export enum EligibilityErrorTypes {
  ELIGIBILITY_LOADING_ERROR,
}

export type GetEligibilityForPersonResponse = {
  styledEligibilityContent?: StyledEligibilityContent;
  eligibilityError?: EligibilityErrorTypes;
};

export type StyledEligibilityContent = {
  dummy: string;
};
