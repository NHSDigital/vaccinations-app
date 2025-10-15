import { Brand } from "@src/utils/types";

enum VaccineTypes {
  RSV = "RSV",
  RSV_PREGNANCY = "RSV_PREGNANCY",
}

// vaccine suffix paths used by the app (e.g. /vaccines/"rsv")
enum VaccineContentUrlPaths {
  RSV = "rsv",
  RSV_PREGNANCY = "rsv-pregnancy",
}

// maps vaccine url path to vaccine type (one to one)
const vaccineUrlPathToType: Record<VaccineContentUrlPaths, VaccineTypes> = {
  [VaccineContentUrlPaths.RSV]: VaccineTypes.RSV,
  [VaccineContentUrlPaths.RSV_PREGNANCY]: VaccineTypes.RSV_PREGNANCY,
};
// maps vaccine type to url path (one to one)
const vaccineTypeToUrlPath: Record<VaccineTypes, VaccineContentUrlPaths> = {
  [VaccineTypes.RSV]: VaccineContentUrlPaths.RSV,
  [VaccineTypes.RSV_PREGNANCY]: VaccineContentUrlPaths.RSV_PREGNANCY,
};

export type VaccineDetails = {
  displayName: displayName;
  heading: string;
  nhsWebpageLink: URL;
  nhsHowToGetWebpageLink: URL;
  personalisedEligibilityStatusRequired: boolean;
  forOlderAdults: boolean;
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
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/rsv-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/rsv-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: true,
    forOlderAdults: true,
  },
  [VaccineTypes.RSV_PREGNANCY]: {
    displayName: {
      titleCase: "RSV",
      midSentenceCase: "RSV",
      indefiniteArticle: "an",
    },
    heading: "RSV vaccine in pregnancy",
    nhsWebpageLink: new URL("https://www.nhs.uk/vaccinations/rsv-vaccine/"),
    nhsHowToGetWebpageLink: new URL("https://www.nhs.uk/vaccinations/rsv-vaccine/#how-to-get-it"),
    personalisedEligibilityStatusRequired: false,
    forOlderAdults: false,
  },
};

export type NhsNumber = Brand<string, "NhsNumber">;

export { VaccineTypes, VaccineInfo, VaccineContentUrlPaths, vaccineUrlPathToType, vaccineTypeToUrlPath };
