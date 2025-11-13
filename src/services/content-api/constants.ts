import { VaccineTypes } from "@src/models/vaccine";

// vaccine suffix paths used in content API endpoint
enum VaccineContentPaths {
  RSV = "rsv-vaccine",
  TD_IPV_3_IN_1 = "td-ipv-vaccine-3-in-1-teenage-booster",
  VACCINE_6_IN_1 = "6-in-1-vaccine",
  ROTAVIRUS = "rotavirus-vaccine",
  HPV = "hpv-vaccine",
  MENB_CHILDREN = "menb-vaccine-for-children",
  MMR = "mmr-vaccine",
  PNEUMOCOCCAL = "pneumococcal-vaccine",
  SHINGLES = "shingles-vaccine",
  MENACWY = "menacwy-vaccine",
}

// maps vaccine type to content API paths (many to one, e.g. case RSV)
const vaccineTypeToPath: Record<VaccineTypes, VaccineContentPaths> = {
  [VaccineTypes.RSV]: VaccineContentPaths.RSV,
  [VaccineTypes.RSV_PREGNANCY]: VaccineContentPaths.RSV,
  [VaccineTypes.TD_IPV_3_IN_1]: VaccineContentPaths.TD_IPV_3_IN_1,
  [VaccineTypes.VACCINE_6_IN_1]: VaccineContentPaths.VACCINE_6_IN_1,
  [VaccineTypes.ROTAVIRUS]: VaccineContentPaths.ROTAVIRUS,
  [VaccineTypes.HPV]: VaccineContentPaths.HPV,
  [VaccineTypes.MENB_CHILDREN]: VaccineContentPaths.MENB_CHILDREN,
  [VaccineTypes.MMR]: VaccineContentPaths.MMR,
  [VaccineTypes.PNEUMOCOCCAL]: VaccineContentPaths.PNEUMOCOCCAL,
  [VaccineTypes.SHINGLES]: VaccineContentPaths.SHINGLES,
  [VaccineTypes.MENACWY]: VaccineContentPaths.MENACWY,
};

const INVALIDATED_CONTENT_OVERWRITE_VALUE =
  '{ "cacheStatus": "INVALIDATED", "reason": "Content changed since last approved" }';

export { VaccineContentPaths, vaccineTypeToPath, INVALIDATED_CONTENT_OVERWRITE_VALUE };
