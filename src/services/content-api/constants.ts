import { VaccineTypes } from "@src/models/vaccine";

// vaccine suffix paths used in content API endpoint
enum VaccineContentPaths {
  RSV = "rsv-vaccine",
}

// maps vaccine type to content API paths (many to one, e.g. case RSV)
const vaccineTypeToPath: Record<VaccineTypes, VaccineContentPaths> = {
  [VaccineTypes.RSV]: VaccineContentPaths.RSV,
  [VaccineTypes.RSV_PREGNANCY]: VaccineContentPaths.RSV,
};

const INVALIDATED_CONTENT_OVERWRITE_VALUE =
  '{ "cacheStatus": "INVALIDATED", "reason": "Content changed since last approved" }';

export { VaccineContentPaths, vaccineTypeToPath, INVALIDATED_CONTENT_OVERWRITE_VALUE };
