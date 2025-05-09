enum VaccineTypes {
  SIX_IN_ONE = "SIX_IN_ONE",
  RSV = "RSV",
  FLU = "FLU",
  PNEUMOCOCCAL = "PNEUMOCOCCAL",
  SHINGLES = "SHINGLES",
  MENACWY = "MENACWY",
}

export type VaccineDetails = {
  displayName: displayName;
  overviewInsetText?: string;
};

type displayName = {
  capitalised: string;
  lowercase: string;
};

const VaccineInfo: Record<VaccineTypes, VaccineDetails> = {
  [VaccineTypes.SIX_IN_ONE]: {
    displayName: {
      capitalised: "6-in-1",
      lowercase: "6-in-1",
    },
  },
  [VaccineTypes.RSV]: {
    displayName: {
      capitalised: "RSV",
      lowercase: "RSV",
    },
  },
  [VaccineTypes.PNEUMOCOCCAL]: {
    displayName: {
      capitalised: "Pneumococcal",
      lowercase: "pneumococcal",
    },
  },
  [VaccineTypes.SHINGLES]: {
    displayName: {
      capitalised: "Shingles",
      lowercase: "shingles",
    },
  },
  [VaccineTypes.FLU]: {
    displayName: {
      capitalised: "Flu",
      lowercase: "flu",
    },
    overviewInsetText:
      '<p>This page is about the flu vaccine for adults. There are also pages about the <a href="/vaccines/child-flu">children\'s flu vaccine</a> and <a href="/vaccines/flu-jab">flu jab in pregnancy</a>.</p>',
  },
  [VaccineTypes.MENACWY]: {
    displayName: {
      capitalised: "MenACWY",
      lowercase: "MenACWY",
    },
  },
};

export { VaccineTypes, VaccineInfo };
