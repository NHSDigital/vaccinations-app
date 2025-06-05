export enum ContentErrorTypes {
  CONTENT_LOADING_ERROR,
}

export type GetEligibilityForPersonResponse = {
  styledEligibilityContent?: StyledEligibilityContent;
  contentError?: ContentErrorTypes;
};

export type StyledEligibilityContent = {
  dummy: string;
};
