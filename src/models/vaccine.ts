enum VaccineTypes {
  SIX_IN_ONE = "SIX_IN_ONE",
  RSV = "RSV",
  FLU = "FLU",
  PNEUMOCOCCAL = "PNEUMOCOCCAL",
  SHINGLES = "SHINGLES",
}

export type VaccineDetails = {
  displayName: string;
  overviewInsetText?: string;
};

const VaccineInfo: Record<VaccineTypes, VaccineDetails> = {
  [VaccineTypes.SIX_IN_ONE]: {
    displayName: "6-in-1",
  },
  [VaccineTypes.RSV]: {
    displayName: "RSV",
  },
  [VaccineTypes.FLU]: {
    displayName: "Flu",
    overviewInsetText:
      '<p>This page is about the flu vaccine for adults. There are also pages about the <a href="/vaccines/child-flu">children\'s flu vaccine</a> and <a href="/vaccines/flu-jab">flu jab in pregnancy</a>.</p>',
  },
  [VaccineTypes.PNEUMOCOCCAL]: {
    displayName: "Pneumococcal",
  },
  [VaccineTypes.SHINGLES]: {
    displayName: "Shingles",
  },
};

export { VaccineTypes, VaccineInfo };
