enum VaccineTypes {
  SIX_IN_ONE = "SIX_IN_ONE",
  RSV = "RSV",
  FLU = "FLU",
}

type VaccineDetails = {
  displayName: string;
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
  },
};

export { VaccineTypes, VaccineInfo };
