enum VaccineTypes {
  SIX_IN_ONE = "SIX_IN_ONE",
  RSV = "RSV",
  FLU = "FLU",
}

const VaccineDisplayNames: Record<VaccineTypes, string> = {
  [VaccineTypes.SIX_IN_ONE]: "6-in-1",
  [VaccineTypes.RSV]: "RSV",
  [VaccineTypes.FLU]: "Flu",
};

export { VaccineTypes, VaccineDisplayNames };
