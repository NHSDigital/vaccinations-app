import { Brand } from "@src/utils/types";

export type NhsNumber = Brand<string, "NhsNumber">;
export type UrlPathFragment = Brand<string, "UrlPathFragment">;
export type Filename = Brand<string, "Filename">;
export type NbsCampaign = Brand<string, "NbsCampaign">;

enum VaccineType {
  RSV = "RSV",
  RSV_PREGNANCY = "RSV_PREGNANCY",
  TD_IPV_3_IN_1 = "TD_IPV_3_IN_1",
  VACCINE_6_IN_1 = "VACCINE_6_IN_1",
  ROTAVIRUS = "ROTAVIRUS",
  HPV = "HPV",
  MENB_CHILDREN = "MENB_CHILDREN",
  MMR = "MMR",
  MMRV = "MMRV",
  PNEUMOCOCCAL = "PNEUMOCOCCAL",
  SHINGLES = "SHINGLES",
  MENACWY = "MENACWY",
  VACCINE_4_IN_1 = "VACCINE_4_IN_1",
  WHOOPING_COUGH = "WHOOPING_COUGH",
  FLU_IN_PREGNANCY = "FLU_IN_PREGNANCY",
  COVID_19 = "COVID_19",
  FLU_FOR_ADULTS = "FLU_FOR_ADULTS",
  FLU_FOR_CHILDREN = "FLU_FOR_CHILDREN",
  FLU_FOR_SCHOOL_AGED_CHILDREN = "FLU_FOR_SCHOOL_AGED_CHILDREN",
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
  nbsPath?: UrlPathFragment;
  nbsCampaign?: NbsCampaign;
  supressWarningCallout?: boolean;
  moreInformationHeadersFromContentApi?: boolean;
};

type displayName = {
  titleCase: string;
  midSentenceCase: string;
  indefiniteArticle: string;
  suffix: string;
};

const VaccineInfo: Record<VaccineType, VaccineDetails> = {
  [VaccineType.RSV]: {
    urlPath: "rsv" as UrlPathFragment,
    displayName: {
      titleCase: "RSV",
      midSentenceCase: "RSV",
      indefiniteArticle: "an",
      suffix: "vaccine",
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
    nbsCampaign: "vita-RSV-booking" as NbsCampaign,
  },
  [VaccineType.RSV_PREGNANCY]: {
    urlPath: "rsv-pregnancy" as UrlPathFragment,
    displayName: {
      titleCase: "RSV",
      midSentenceCase: "RSV",
      indefiniteArticle: "an",
      suffix: "vaccine",
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
    nbsPath: "rsv" as UrlPathFragment,
    nbsCampaign: "vita-RSV-booking" as NbsCampaign,
  },
  [VaccineType.TD_IPV_3_IN_1]: {
    urlPath: "td-ipv-vaccine-3-in-1-teenage-booster" as UrlPathFragment,
    displayName: {
      titleCase: "Td/IPV",
      midSentenceCase: "Td/IPV",
      indefiniteArticle: "a",
      suffix: "vaccine",
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
  },
  [VaccineType.VACCINE_6_IN_1]: {
    urlPath: "6-in-1-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "6-in-1",
      midSentenceCase: "6-in-1",
      indefiniteArticle: "a",
      suffix: "vaccine",
    },
    heading: "6-in-1 vaccine",
    cardLinkTitle: "6-in-1",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/6-in-1-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/6-in-1-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/6-in-1-vaccine" as UrlPathFragment,
    cacheFilename: "6-in-1-vaccine.json" as Filename,
  },
  [VaccineType.ROTAVIRUS]: {
    urlPath: "rotavirus-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "Rotavirus",
      midSentenceCase: "rotavirus",
      indefiniteArticle: "a",
      suffix: "vaccine",
    },
    heading: "Rotavirus vaccine",
    cardLinkTitle: "Rotavirus",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/rotavirus-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/rotavirus-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/rotavirus-vaccine" as UrlPathFragment,
    cacheFilename: "rotavirus-vaccine.json" as Filename,
  },
  [VaccineType.HPV]: {
    urlPath: "hpv-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "HPV",
      midSentenceCase: "HPV",
      indefiniteArticle: "an",
      suffix: "vaccine",
    },
    heading: "HPV vaccine",
    cardLinkTitle: "HPV",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/hpv-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/hpv-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/hpv-vaccine" as UrlPathFragment,
    cacheFilename: "hpv-vaccine.json" as Filename,
    supressWarningCallout: true,
  },
  [VaccineType.MENB_CHILDREN]: {
    urlPath: "menb-vaccine-for-children" as UrlPathFragment,
    displayName: {
      titleCase: "MenB",
      midSentenceCase: "MenB",
      indefiniteArticle: "an",
      suffix: "vaccine",
    },
    heading: "MenB vaccine for children",
    cardLinkTitle: "MenB",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/menb-vaccine-for-children/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/menb-vaccine-for-children/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/menb-vaccine-for-children" as UrlPathFragment,
    cacheFilename: "menb-vaccine-for-children.json" as Filename,
  },
  [VaccineType.MMR]: {
    urlPath: "mmr-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "MMR",
      midSentenceCase: "MMR",
      indefiniteArticle: "an",
      suffix: "vaccine",
    },
    heading: "MMR (measles, mumps and rubella) vaccine",
    cardLinkTitle: "MMR (measles, mumps and rubella)",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/mmr-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/mmr-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/mmr-vaccine" as UrlPathFragment,
    cacheFilename: "mmr-vaccine.json" as Filename,
  },
  [VaccineType.MMRV]: {
    urlPath: "mmrv-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "MMRV",
      midSentenceCase: "MMRV",
      indefiniteArticle: "an",
      suffix: "vaccine",
    },
    heading: "MMRV (measles, mumps, rubella and chickenpox) vaccine",
    cardLinkTitle: "MMRV (measles, mumps, rubella and chickenpox)",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/mmrv-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/mmrv-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/mmrv-vaccine" as UrlPathFragment,
    cacheFilename: "mmrv-vaccine.json" as Filename,
  },
  [VaccineType.PNEUMOCOCCAL]: {
    urlPath: "pneumococcal-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "Pneumococcal",
      midSentenceCase: "pneumococcal",
      indefiniteArticle: "a",
      suffix: "vaccine",
    },
    heading: "Pneumococcal vaccine",
    cardLinkTitle: "Pneumococcal",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/pneumococcal-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/pneumococcal-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/pneumococcal-vaccine" as UrlPathFragment,
    cacheFilename: "pneumococcal-vaccine.json" as Filename,
  },
  [VaccineType.SHINGLES]: {
    urlPath: "shingles-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "Shingles",
      midSentenceCase: "shingles",
      indefiniteArticle: "a",
      suffix: "vaccine",
    },
    heading: "Shingles vaccine",
    cardLinkTitle: "Shingles",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/shingles-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/shingles-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/shingles-vaccine" as UrlPathFragment,
    cacheFilename: "shingles-vaccine.json" as Filename,
    supressWarningCallout: true,
  },
  [VaccineType.MENACWY]: {
    urlPath: "menacwy-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "MenACWY",
      midSentenceCase: "MenACWY",
      indefiniteArticle: "a",
      suffix: "vaccine",
    },
    heading: "MenACWY vaccine",
    cardLinkTitle: "MenACWY",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/menacwy-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/menacwy-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/menacwy-vaccine" as UrlPathFragment,
    cacheFilename: "menacwy-vaccine.json" as Filename,
    supressWarningCallout: true,
  },
  [VaccineType.VACCINE_4_IN_1]: {
    urlPath: "4-in-1-preschool-booster-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "4-in-1 pre-school booster",
      midSentenceCase: "4-in-1 pre-school booster",
      indefiniteArticle: "a",
      suffix: "vaccine",
    },
    heading: "4-in-1 pre-school booster vaccine",
    cardLinkTitle: "4-in-1 pre-school booster",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/4-in-1-preschool-booster-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/4-in-1-preschool-booster-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/4-in-1-preschool-booster-vaccine" as UrlPathFragment,
    cacheFilename: "4-in-1-preschool-booster-vaccine.json" as Filename,
  },
  [VaccineType.WHOOPING_COUGH]: {
    urlPath: "whooping-cough-vaccination" as UrlPathFragment,
    displayName: {
      titleCase: "Whooping cough vaccine in pregnancy",
      midSentenceCase: "whooping cough",
      indefiniteArticle: "a",
      suffix: "vaccine",
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
    moreInformationHeadersFromContentApi: true,
  },
  [VaccineType.FLU_IN_PREGNANCY]: {
    urlPath: "flu-vaccine-in-pregnancy" as UrlPathFragment,
    displayName: {
      titleCase: "The flu vaccine in pregnancy",
      midSentenceCase: "flu",
      indefiniteArticle: "a",
      suffix: "vaccine in pregnancy",
    },
    heading: "The flu vaccine in pregnancy",
    cardLinkTitle: "Flu in pregnancy",
    cardLinkDescription: "During flu season",
    nhsWebpageLink: new URL("https://www.nhs.uk/pregnancy/keeping-well/flu-jab/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/pregnancy/keeping-well/flu-jab/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "pregnancy/keeping-well/flu-jab" as UrlPathFragment,
    cacheFilename: "flu-jab.json" as Filename,
    moreInformationHeadersFromContentApi: true,
    nbsPath: "flu" as UrlPathFragment,
    nbsCampaign: "vita-flu-booking" as NbsCampaign,
  },
  [VaccineType.COVID_19]: {
    urlPath: "covid-19-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "COVID-19",
      midSentenceCase: "COVID-19",
      indefiniteArticle: "a",
      suffix: "vaccine",
    },
    heading: "COVID-19 vaccine",
    cardLinkTitle: "COVID-19",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/covid-19-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/covid-19-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/covid-19-vaccine" as UrlPathFragment,
    cacheFilename: "covid-19-vaccine.json" as Filename,
    nbsPath: "covid" as UrlPathFragment,
    nbsCampaign: "vita-COVID-booking" as NbsCampaign,
  },
  [VaccineType.FLU_FOR_ADULTS]: {
    urlPath: "flu-vaccine" as UrlPathFragment,
    displayName: {
      titleCase: "Flu",
      midSentenceCase: "flu",
      indefiniteArticle: "a",
      suffix: "vaccine",
    },
    heading: "Flu vaccine",
    cardLinkTitle: "Flu",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/flu-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/flu-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/flu-vaccine" as UrlPathFragment,
    cacheFilename: "flu-vaccine.json" as Filename,
    nbsPath: "flu" as UrlPathFragment,
    nbsCampaign: "vita-flu-booking" as NbsCampaign,
  },
  [VaccineType.FLU_FOR_CHILDREN]: {
    urlPath: "flu-vaccine-for-children" as UrlPathFragment,
    displayName: {
      titleCase: "Flu",
      midSentenceCase: "children's flu",
      indefiniteArticle: "a",
      suffix: "vaccine",
    },
    heading: "Flu vaccine for children aged 2 to 3",
    cardLinkTitle: "Flu for children aged 2 to 3",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/child-flu-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/child-flu-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/child-flu-vaccine" as UrlPathFragment,
    cacheFilename: "child-flu-vaccine.json" as Filename,
    nbsPath: "flu" as UrlPathFragment,
    nbsCampaign: "vita-flu-booking" as NbsCampaign,
  },
  [VaccineType.FLU_FOR_SCHOOL_AGED_CHILDREN]: {
    urlPath: "flu-vaccine-for-school-aged-children" as UrlPathFragment,
    displayName: {
      titleCase: "Flu",
      midSentenceCase: "children's flu",
      indefiniteArticle: "a",
      suffix: "vaccine",
    },
    heading: "Flu vaccine for school-aged children",
    cardLinkTitle: "Flu for school-aged children (Reception to Year 11)",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/child-flu-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/child-flu-vaccine/#how-to-get-it"),
    removeHowToGetExpanderFromMoreInformationSection: true,
    personalisedEligibilityStatusRequired: false,
    contentPath: "vaccinations/child-flu-vaccine" as UrlPathFragment,
    cacheFilename: "child-flu-vaccine.json" as Filename,
  },
};

const vaccineUrlPathToVaccineType = new Map<UrlPathFragment, VaccineType>();
Object.entries(VaccineInfo).forEach(([vaccineType, vaccineDetails]) => {
  vaccineUrlPathToVaccineType.set(vaccineDetails.urlPath, vaccineType as VaccineType);
});

const adultVaccines: VaccineType[] = [
  VaccineType.COVID_19,
  VaccineType.FLU_FOR_ADULTS,
  VaccineType.RSV,
  VaccineType.SHINGLES,
  VaccineType.PNEUMOCOCCAL,
];
const pregnancyVaccines: VaccineType[] = [
  VaccineType.WHOOPING_COUGH,
  VaccineType.RSV_PREGNANCY,
  VaccineType.FLU_IN_PREGNANCY,
];
const childVaccines: VaccineType[] = [
  VaccineType.FLU_FOR_CHILDREN,
  VaccineType.FLU_FOR_SCHOOL_AGED_CHILDREN,
  VaccineType.TD_IPV_3_IN_1,
  VaccineType.MENACWY,
  VaccineType.HPV,
  VaccineType.VACCINE_4_IN_1,
  VaccineType.MMR,
  VaccineType.MMRV,
  VaccineType.MENB_CHILDREN,
  VaccineType.PNEUMOCOCCAL,
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
