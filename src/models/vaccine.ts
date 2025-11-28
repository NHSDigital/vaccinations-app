import { Brand } from "@src/utils/types";

export type NhsNumber = Brand<string, "NhsNumber">;
export type UrlPathFragment = Brand<string, "UrlPathFragment">;
export type Filename = Brand<string, "Filename">;

enum VaccineType {
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
  WHOOPING_COUGH = "WHOOPING_COUGH",
  HIB_MENC = "HIB_MENC",
  FLU_IN_PREGNANCY = "FLU_IN_PREGNANCY",
}

export type VaccineDetails = {
  urlPath: UrlPathFragment;
  displayName: displayName;
  heading: string;
  cardLinkTitle: string;
  cardLinkDescription?: string;
  nhsWebpageLink: URL;
  nhsHowToGetWebpageLink: URL;
  personalisedEligibilityStatusRequired: boolean;
  forOlderAdults?: boolean;
  removeHowToGetExpanderFromMoreInformationSection?: boolean;
  contentPath: UrlPathFragment;
  cacheFilename: Filename;
  nbsPath: UrlPathFragment;
  showWarningCallout?: boolean;
};

type displayName = {
  titleCase: string;
  midSentenceCase: string;
  indefiniteArticle: string;
};

const VaccineInfo: Record<VaccineType, VaccineDetails> = {
  [VaccineType.RSV]: {
    urlPath: "rsv" as UrlPathFragment,
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
    contentPath: "vaccinations/rsv-vaccine" as UrlPathFragment,
    cacheFilename: "rsv-vaccine.json" as Filename,
    nbsPath: "rsv" as UrlPathFragment,
  },
  [VaccineType.RSV_PREGNANCY]: {
    urlPath: "rsv-pregnancy" as UrlPathFragment,
    displayName: {
      titleCase: "RSV",
      midSentenceCase: "RSV",
      indefiniteArticle: "an",
    },
    heading: "RSV vaccine in pregnancy",
    cardLinkTitle: "RSV in pregnancy",
    cardLinkDescription: "From 28 weeks",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/rsv-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/rsv-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    forOlderAdults: false,
    removeHowToGetExpanderFromMoreInformationSection: true,
    contentPath: "vaccinations/rsv-vaccine" as UrlPathFragment,
    cacheFilename: "rsv-vaccine.json" as Filename,
    nbsPath: "rsv-pregnancy" as UrlPathFragment,
  },
  [VaccineType.TD_IPV_3_IN_1]: {
    urlPath: "td-ipv-vaccine-3-in-1-teenage-booster" as UrlPathFragment,
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
    contentPath: "vaccinations/td-ipv-vaccine-3-in-1-teenage-booster" as UrlPathFragment,
    cacheFilename: "td-ipv-vaccine-3-in-1-teenage-booster.json" as Filename,
    nbsPath: "td-ipv-vaccine-3-in-1-teenage-booster" as UrlPathFragment,
  },
  [VaccineType.VACCINE_6_IN_1]: {
    urlPath: "6-in-1-vaccine" as UrlPathFragment,
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
    contentPath: "vaccinations/6-in-1-vaccine" as UrlPathFragment,
    cacheFilename: "6-in-1-vaccine.json" as Filename,
    nbsPath: "6-in-1-vaccine" as UrlPathFragment,
  },
  [VaccineType.ROTAVIRUS]: {
    urlPath: "rotavirus-vaccine" as UrlPathFragment,
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
    contentPath: "vaccinations/rotavirus-vaccine" as UrlPathFragment,
    cacheFilename: "rotavirus-vaccine.json" as Filename,
    nbsPath: "rotavirus-vaccine" as UrlPathFragment,
  },
  [VaccineType.HPV]: {
    urlPath: "hpv-vaccine" as UrlPathFragment,
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
    contentPath: "vaccinations/hpv-vaccine" as UrlPathFragment,
    cacheFilename: "hpv-vaccine.json" as Filename,
    nbsPath: "hpv-vaccine" as UrlPathFragment,
  },
  [VaccineType.MENB_CHILDREN]: {
    urlPath: "menb-vaccine-for-children" as UrlPathFragment,
    displayName: {
      titleCase: "MenB",
      midSentenceCase: "MenB",
      indefiniteArticle: "an",
    },
    heading: "MenB vaccine for children",
    cardLinkTitle: "MenB",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/menb-vaccine-for-children/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/menb-vaccine-for-children/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/menb-vaccine-for-children" as UrlPathFragment,
    cacheFilename: "menb-vaccine-for-children.json" as Filename,
    nbsPath: "menb-vaccine-for-children" as UrlPathFragment,
  },
  [VaccineType.MMR]: {
    urlPath: "mmr-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "MMR",
      midSentenceCase: "MMR",
      indefiniteArticle: "an",
    },
    heading: "MMR vaccine",
    cardLinkTitle: "MMR (measles, mumps and rubella)",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/mmr-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/mmr-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/mmr-vaccine" as UrlPathFragment,
    cacheFilename: "mmr-vaccine.json" as Filename,
    nbsPath: "mmr-vaccine" as UrlPathFragment,
  },
  [VaccineType.PNEUMOCOCCAL]: {
    urlPath: "pneumococcal-vaccine" as UrlPathFragment,
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
    contentPath: "vaccinations/pneumococcal-vaccine" as UrlPathFragment,
    cacheFilename: "pneumococcal-vaccine.json" as Filename,
    nbsPath: "pneumococcal-vaccine" as UrlPathFragment,
  },
  [VaccineType.SHINGLES]: {
    urlPath: "shingles-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "Shingles",
      midSentenceCase: "shingles",
      indefiniteArticle: "a",
    },
    heading: "Shingles vaccine",
    cardLinkTitle: "Shingles",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/shingles-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/shingles-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/shingles-vaccine" as UrlPathFragment,
    cacheFilename: "shingles-vaccine.json" as Filename,
    nbsPath: "shingles-vaccine" as UrlPathFragment,
  },
  [VaccineType.MENACWY]: {
    urlPath: "menacwy-vaccine" as UrlPathFragment,
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
    contentPath: "vaccinations/menacwy-vaccine" as UrlPathFragment,
    cacheFilename: "menacwy-vaccine.json" as Filename,
    nbsPath: "menacwy-vaccine" as UrlPathFragment,
  },
  [VaccineType.VACCINE_4_IN_1]: {
    urlPath: "4-in-1-preschool-booster-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "4-in-1 pre-school booster",
      midSentenceCase: "4-in-1 pre-school booster",
      indefiniteArticle: "a",
    },
    heading: "4-in-1 pre-school booster vaccine",
    cardLinkTitle: "4-in-1 pre-school booster",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/4-in-1-preschool-booster-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/4-in-1-preschool-booster-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/4-in-1-preschool-booster-vaccine" as UrlPathFragment,
    cacheFilename: "4-in-1-preschool-booster-vaccine.json" as Filename,
    nbsPath: "4-in-1-preschool-booster-vaccine" as UrlPathFragment,
  },
  [VaccineType.WHOOPING_COUGH]: {
    urlPath: "whooping-cough-vaccination" as UrlPathFragment,
    displayName: {
      titleCase: "Whooping cough vaccine in pregnancy",
      midSentenceCase: "whooping cough",
      indefiniteArticle: "a",
    },
    heading: "Whooping cough vaccine in pregnancy",
    cardLinkTitle: "Whooping cough (pertussis) in pregnancy",
    cardLinkDescription: "Around 20 weeks",
    nhsWebpageLink: new URL("https://www.nhs.uk/pregnancy/keeping-well/whooping-cough-vaccination/"),
    nhsHowToGetWebpageLink: new URL(
      "https://www.nhs.uk/pregnancy/keeping-well/whooping-cough-vaccination/#how-to-get-it",
    ),
    personalisedEligibilityStatusRequired: false,
    contentPath: "pregnancy/keeping-well/whooping-cough-vaccination" as UrlPathFragment,
    cacheFilename: "whooping-cough-vaccination.json" as Filename,
    nbsPath: "whooping-cough-vaccination" as UrlPathFragment,
  },
  [VaccineType.HIB_MENC]: {
    urlPath: "hib-menc-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "Hib/MenC",
      midSentenceCase: "Hib/MenC",
      indefiniteArticle: "a",
    },
    heading: "Hib/MenC vaccine",
    cardLinkTitle: "Hib/MenC",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/hib-menc-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/hib-menc-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/hib-menc-vaccine" as UrlPathFragment,
    cacheFilename: "hib-menc-vaccine.json" as Filename,
    nbsPath: "hib-menc-vaccine" as UrlPathFragment,
    showWarningCallout: true,
  },
  [VaccineType.FLU_IN_PREGNANCY]: {
    urlPath: "flu-vaccine-in-pregnancy" as UrlPathFragment,
    displayName: {
      titleCase: "The flu vaccine in pregnancy",
      midSentenceCase: "flu",
      indefiniteArticle: "a",
    },
    heading: "The flu vaccine in pregnancy",
    cardLinkTitle: "Flu in pregnancy",
    cardLinkDescription: "During flu season",
    nhsWebpageLink: new URL("https://www.nhs.uk/pregnancy/keeping-well/flu-jab/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/pregnancy/keeping-well/flu-jab/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "pregnancy/keeping-well/flu-jab" as UrlPathFragment,
    cacheFilename: "flu-jab.json" as Filename,
    nbsPath: "flu-vaccine-in-pregnancy" as UrlPathFragment,
  },
};

const vaccineUrlPathToVaccineType = new Map<UrlPathFragment, VaccineType>();
Object.entries(VaccineInfo).forEach(([vaccineType, vaccineDetails]) => {
  vaccineUrlPathToVaccineType.set(vaccineDetails.urlPath, vaccineType as VaccineType);
});

const adultVaccines: VaccineType[] = [VaccineType.RSV, VaccineType.SHINGLES, VaccineType.PNEUMOCOCCAL];
const pregnancyVaccines: VaccineType[] = [
  VaccineType.WHOOPING_COUGH,
  VaccineType.RSV_PREGNANCY,
  VaccineType.FLU_IN_PREGNANCY,
];
const childVaccines: VaccineType[] = [
  VaccineType.TD_IPV_3_IN_1,
  VaccineType.MENACWY,
  VaccineType.HPV,
  VaccineType.VACCINE_4_IN_1,
  VaccineType.MMR,
  VaccineType.MENB_CHILDREN,
  VaccineType.PNEUMOCOCCAL,
  VaccineType.HIB_MENC,
];
const babyVaccines: VaccineType[] = [
  VaccineType.VACCINE_6_IN_1,
  VaccineType.ROTAVIRUS,
  VaccineType.PNEUMOCOCCAL,
  VaccineType.MENB_CHILDREN,
];

export {
  VaccineType,
  VaccineInfo,
  vaccineUrlPathToVaccineType,
  adultVaccines,
  pregnancyVaccines,
  childVaccines,
  babyVaccines,
};
