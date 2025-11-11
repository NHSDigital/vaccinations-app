import { Brand } from "@src/utils/types";

enum VaccineTypes {
  RSV = "RSV",
  RSV_PREGNANCY = "RSV_PREGNANCY",
  TD_IPV_3_IN_1 = "TD_IPV_3_IN_1",
  VACCINE_6_IN_1 = "VACCINE_6_IN_1",
}

// vaccine suffix paths used by the app (e.g. /vaccines/"rsv")
enum VaccineContentUrlPaths {
  RSV = "rsv",
  RSV_PREGNANCY = "rsv-pregnancy",
  TD_IPV_3_IN_1 = "td-ipv-vaccine-3-in-1-teenage-booster",
  VACCINE_6_IN_1 = "6-in-1-vaccine",
}

// maps vaccine url path to vaccine type (one to one)
const vaccineUrlPathToType: Record<VaccineContentUrlPaths, VaccineTypes> = {
  [VaccineContentUrlPaths.RSV]: VaccineTypes.RSV,
  [VaccineContentUrlPaths.RSV_PREGNANCY]: VaccineTypes.RSV_PREGNANCY,
  [VaccineContentUrlPaths.TD_IPV_3_IN_1]: VaccineTypes.TD_IPV_3_IN_1,
  [VaccineContentUrlPaths.VACCINE_6_IN_1]: VaccineTypes.VACCINE_6_IN_1,
};
// maps vaccine type to url path (one to one)
const vaccineTypeToUrlPath: Record<VaccineTypes, VaccineContentUrlPaths> = {
  [VaccineTypes.RSV]: VaccineContentUrlPaths.RSV,
  [VaccineTypes.RSV_PREGNANCY]: VaccineContentUrlPaths.RSV_PREGNANCY,
  [VaccineTypes.TD_IPV_3_IN_1]: VaccineContentUrlPaths.TD_IPV_3_IN_1,
  [VaccineTypes.VACCINE_6_IN_1]: VaccineContentUrlPaths.VACCINE_6_IN_1,
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
};

export type NhsNumber = Brand<string, "NhsNumber">;

export { VaccineTypes, VaccineInfo, VaccineContentUrlPaths, vaccineUrlPathToType, vaccineTypeToUrlPath };
