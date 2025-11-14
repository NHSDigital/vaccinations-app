import { Brand } from "@src/utils/types";

enum VaccineTypes {
  RSV = "RSV",
  RSV_PREGNANCY = "RSV_PREGNANCY",
  TD_IPV_3_IN_1 = "TD_IPV_3_IN_1",
  VACCINE_6_IN_1 = "VACCINE_6_IN_1",
  ROTAVIRUS = "ROTAVIRUS",
  HPV = "HPV",
  MENB_CHILDREN = "MENB_CHILDREN",
  MMR = "MMR",
  PNEUMOCOCCAL = "PNEUMOCOCCAL",
  SHINGLES = "SHINGLES",
  MENACWY = "MENACWY",
  VACCINE_4_IN_1 = "VACCINE_4_IN_1",
}

// vaccine suffix paths used by the app (e.g. /vaccines/"rsv")
enum VaccineContentUrlPaths {
  RSV = "rsv",
  RSV_PREGNANCY = "rsv-pregnancy",
  TD_IPV_3_IN_1 = "td-ipv-vaccine-3-in-1-teenage-booster",
  VACCINE_6_IN_1 = "6-in-1-vaccine",
  ROTAVIRUS = "rotavirus-vaccine",
  HPV = "hpv-vaccine",
  MENB_CHILDREN = "menb-vaccine-for-children",
  MMR = "mmr-vaccine",
  PNEUMOCOCCAL = "pneumococcal-vaccine",
  SHINGLES = "shingles-vaccine",
  MENACWY = "menacwy-vaccine",
  VACCINE_4_IN_1 = "4-in-1-preschool-booster-vaccine",
}

// maps vaccine url path to vaccine type (one to one)
const vaccineUrlPathToType: Record<VaccineContentUrlPaths, VaccineTypes> = {
  [VaccineContentUrlPaths.RSV]: VaccineTypes.RSV,
  [VaccineContentUrlPaths.RSV_PREGNANCY]: VaccineTypes.RSV_PREGNANCY,
  [VaccineContentUrlPaths.TD_IPV_3_IN_1]: VaccineTypes.TD_IPV_3_IN_1,
  [VaccineContentUrlPaths.VACCINE_6_IN_1]: VaccineTypes.VACCINE_6_IN_1,
  [VaccineContentUrlPaths.ROTAVIRUS]: VaccineTypes.ROTAVIRUS,
  [VaccineContentUrlPaths.HPV]: VaccineTypes.HPV,
  [VaccineContentUrlPaths.MENB_CHILDREN]: VaccineTypes.MENB_CHILDREN,
  [VaccineContentUrlPaths.MMR]: VaccineTypes.MMR,
  [VaccineContentUrlPaths.PNEUMOCOCCAL]: VaccineTypes.PNEUMOCOCCAL,
  [VaccineContentUrlPaths.SHINGLES]: VaccineTypes.SHINGLES,
  [VaccineContentUrlPaths.MENACWY]: VaccineTypes.MENACWY,
  [VaccineContentUrlPaths.VACCINE_4_IN_1]: VaccineTypes.VACCINE_4_IN_1,
};
// maps vaccine type to url path (one to one)
const vaccineTypeToUrlPath: Record<VaccineTypes, VaccineContentUrlPaths> = {
  [VaccineTypes.RSV]: VaccineContentUrlPaths.RSV,
  [VaccineTypes.RSV_PREGNANCY]: VaccineContentUrlPaths.RSV_PREGNANCY,
  [VaccineTypes.TD_IPV_3_IN_1]: VaccineContentUrlPaths.TD_IPV_3_IN_1,
  [VaccineTypes.VACCINE_6_IN_1]: VaccineContentUrlPaths.VACCINE_6_IN_1,
  [VaccineTypes.ROTAVIRUS]: VaccineContentUrlPaths.ROTAVIRUS,
  [VaccineTypes.HPV]: VaccineContentUrlPaths.HPV,
  [VaccineTypes.MENB_CHILDREN]: VaccineContentUrlPaths.MENB_CHILDREN,
  [VaccineTypes.MMR]: VaccineContentUrlPaths.MMR,
  [VaccineTypes.PNEUMOCOCCAL]: VaccineContentUrlPaths.PNEUMOCOCCAL,
  [VaccineTypes.SHINGLES]: VaccineContentUrlPaths.SHINGLES,
  [VaccineTypes.MENACWY]: VaccineContentUrlPaths.MENACWY,
  [VaccineTypes.VACCINE_4_IN_1]: VaccineContentUrlPaths.VACCINE_4_IN_1,
};

export type VaccineDetails = {
  displayName: displayName;
  heading: string;
  cardLinkTitle: string;
  nhsWebpageLink: URL;
  nhsHowToGetWebpageLink: URL;
  personalisedEligibilityStatusRequired: boolean;
  forOlderAdults?: boolean;
  removeHowToGetExpanderFromMoreInformationSection?: boolean;
};

type displayName = {
  titleCase: string;
  midSentenceCase: string;
  indefiniteArticle: string;
};

const VaccineInfo: Record<VaccineTypes, VaccineDetails> = {
  [VaccineTypes.RSV]: {
    displayName: {
      titleCase: "RSV",
      midSentenceCase: "RSV",
      indefiniteArticle: "an",
    },
    heading: "RSV vaccine for older adults",
    cardLinkTitle: "RSV",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/rsv-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/rsv-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: true,
    forOlderAdults: true,
    removeHowToGetExpanderFromMoreInformationSection: true,
  },
  [VaccineTypes.RSV_PREGNANCY]: {
    displayName: {
      titleCase: "RSV",
      midSentenceCase: "RSV",
      indefiniteArticle: "an",
    },
    heading: "RSV vaccine in pregnancy",
    cardLinkTitle: "RSV in pregnancy",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/rsv-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/rsv-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    forOlderAdults: false,
    removeHowToGetExpanderFromMoreInformationSection: true,
  },
  [VaccineTypes.TD_IPV_3_IN_1]: {
    displayName: {
      titleCase: "Td/IPV",
      midSentenceCase: "Td/IPV",
      indefiniteArticle: "a",
    },
    heading: "Td/IPV vaccine (3-in-1 teenage booster)",
    cardLinkTitle: "Td/IPV (3-in-1 teenage booster)",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/td-ipv-vaccine-3-in-1-teenage-booster/"),
    nhsHowToGetWebpageLink: new URL(
      "https://www.nhs.uk/vaccinations/td-ipv-vaccine-3-in-1-teenage-booster/#how-to-get-it",
    ),
    personalisedEligibilityStatusRequired: false,
  },
  [VaccineTypes.VACCINE_6_IN_1]: {
    displayName: {
      titleCase: "6-in-1",
      midSentenceCase: "6-in-1",
      indefiniteArticle: "a",
    },
    heading: "6-in-1 vaccine",
    cardLinkTitle: "6-in-1",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/6-in-1-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/6-in-1-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
  },
  [VaccineTypes.ROTAVIRUS]: {
    displayName: {
      titleCase: "Rotavirus",
      midSentenceCase: "rotavirus",
      indefiniteArticle: "a",
    },
    heading: "Rotavirus vaccine",
    cardLinkTitle: "Rotavirus",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/rotavirus-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/rotavirus-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
  },
  [VaccineTypes.HPV]: {
    displayName: {
      titleCase: "HPV",
      midSentenceCase: "HPV",
      indefiniteArticle: "an",
    },
    heading: "HPV vaccine",
    cardLinkTitle: "HPV",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/hpv-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/hpv-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
  },
  [VaccineTypes.MENB_CHILDREN]: {
    displayName: {
      titleCase: "MenB",
      midSentenceCase: "MenB",
      indefiniteArticle: "an",
    },
    heading: "MenB vaccine",
    cardLinkTitle: "MenB",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/menb-vaccine-for-children/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/menb-vaccine-for-children/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
  },
  [VaccineTypes.MMR]: {
    displayName: {
      titleCase: "MMR",
      midSentenceCase: "MMR",
      indefiniteArticle: "an",
    },
    heading: "MMR vaccine",
    cardLinkTitle: "MMR",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/mmr-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/mmr-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
  },
  [VaccineTypes.PNEUMOCOCCAL]: {
    displayName: {
      titleCase: "Pneumococcal",
      midSentenceCase: "pneumococcal",
      indefiniteArticle: "a",
    },
    heading: "Pneumococcal vaccine",
    cardLinkTitle: "Pneumococcal",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/pneumococcal-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/pneumococcal-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
  },
  [VaccineTypes.SHINGLES]: {
    displayName: {
      titleCase: "Shingles",
      midSentenceCase: "Shingles",
      indefiniteArticle: "a",
    },
    heading: "Shingles vaccine",
    cardLinkTitle: "Shingles",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/shingles-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/shingles-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
  },
  [VaccineTypes.MENACWY]: {
    displayName: {
      titleCase: "MenACWY",
      midSentenceCase: "MenACWY",
      indefiniteArticle: "a",
    },
    heading: "MenACWY vaccine",
    cardLinkTitle: "MenACWY",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/menacwy-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/menacwy-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
  },
  [VaccineTypes.VACCINE_4_IN_1]: {
    displayName: {
      titleCase: "4-in-1 pre-school booster vaccine",
      midSentenceCase: "4-in-1 pre-school booster vaccine",
      indefiniteArticle: "a",
    },
    heading: "4-in-1 pre-school booster vaccine",
    cardLinkTitle: "4-in-1 pre-school booster",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/4-in-1-preschool-booster-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/4-in-1-preschool-booster-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
  },
};

export type NhsNumber = Brand<string, "NhsNumber">;

export { VaccineTypes, VaccineInfo, VaccineContentUrlPaths, vaccineUrlPathToType, vaccineTypeToUrlPath };
