import { VaccineTypes } from "@src/models/vaccine";

enum VaccineContentPaths {
  SIX_IN_ONE = "6-in-1-vaccine",
  RSV = "rsv-vaccine",
  FLU = "flu-vaccine",
  PNEUMOCOCCAL = "pneumococcal-vaccine",
  SHINGLES = "shingles-vaccine",
}

const vaccineTypeToPath: Record<VaccineTypes, VaccineContentPaths> = {
  [VaccineTypes.SIX_IN_ONE]: VaccineContentPaths.SIX_IN_ONE,
  [VaccineTypes.RSV]: VaccineContentPaths.RSV,
  [VaccineTypes.FLU]: VaccineContentPaths.FLU,
  [VaccineTypes.PNEUMOCOCCAL]: VaccineContentPaths.PNEUMOCOCCAL,
  [VaccineTypes.SHINGLES]: VaccineContentPaths.SHINGLES,
};

const CONTENT_API_VACCINATIONS_PATH = "/nhs-website-content/vaccinations";

export {
  VaccineContentPaths,
  CONTENT_API_VACCINATIONS_PATH,
  vaccineTypeToPath,
};
