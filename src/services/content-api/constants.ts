import { VaccineTypes } from "@src/models/vaccine";

enum VaccineContentPaths {
  SIX_IN_ONE = "/6-in-1-vaccine",
  RSV = "/test",
}

const vaccineTypeToPath: Record<VaccineTypes, VaccineContentPaths> = {
  [VaccineTypes.SIX_IN_ONE]: VaccineContentPaths.SIX_IN_ONE,
  [VaccineTypes.RSV]: VaccineContentPaths.RSV,
};

const CONTENT_API_VACCINATIONS_PATH = "/vaccinations";

export {
  VaccineContentPaths,
  CONTENT_API_VACCINATIONS_PATH,
  vaccineTypeToPath,
};
