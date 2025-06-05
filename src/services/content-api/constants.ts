import { VaccineTypes } from "@src/models/vaccine";

enum VaccineContentPaths {
  SIX_IN_ONE = "6-in-1-vaccine",
  RSV = "rsv-vaccine",
  FLU = "flu-vaccine",
  PNEUMOCOCCAL = "pneumococcal-vaccine",
  SHINGLES = "shingles-vaccine",
  MENACWY = "menacwy-vaccine",
  COVID_19 = "covid-19-vaccine",
}

const vaccineTypeToPath: Record<VaccineTypes, VaccineContentPaths> = {
  [VaccineTypes.SIX_IN_ONE]: VaccineContentPaths.SIX_IN_ONE,
  [VaccineTypes.RSV]: VaccineContentPaths.RSV,
  [VaccineTypes.RSV_PREGNANCY]: VaccineContentPaths.RSV,
  [VaccineTypes.FLU]: VaccineContentPaths.FLU,
  [VaccineTypes.PNEUMOCOCCAL]: VaccineContentPaths.PNEUMOCOCCAL,
  [VaccineTypes.SHINGLES]: VaccineContentPaths.SHINGLES,
  [VaccineTypes.MENACWY]: VaccineContentPaths.MENACWY,
  [VaccineTypes.COVID_19]: VaccineContentPaths.COVID_19,
};

export { VaccineContentPaths, vaccineTypeToPath };
