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
  overviewInsetText?: string;
};

type displayName = {
  capitalised: string;
  lowercase: string;
};

const VaccineInfo: Record<VaccineTypes, VaccineDetails> = {
  [VaccineTypes.RSV]: {
    displayName: {
      capitalised: "RSV",
      lowercase: "RSV",
    },
    heading: "RSV vaccine for older adults",
    overviewInsetText: `<p>This page is about the RSV vaccine for older adults. There is also <a href="/vaccines/${VaccineContentUrlPaths.RSV_PREGNANCY}">RSV in pregnancy</a>.</p>`,
  },
  [VaccineTypes.RSV_PREGNANCY]: {
    displayName: {
      capitalised: "RSV",
      lowercase: "RSV",
    },
    heading: "RSV vaccine in pregnancy",
    overviewInsetText: `<p>This page is about the RSV vaccine in pregnancy. There is also <a href="/vaccines/${VaccineContentUrlPaths.RSV}">RSV for older adults</a>.</p>`,
  },
};

export {
  VaccineTypes,
  VaccineInfo,
  VaccineContentUrlPaths,
  vaccineUrlPathToType,
  vaccineTypeToUrlPath,
};
