import {
  VaccineContentUrlPaths,
  VaccineTypes,
  vaccineUrlPathToType,
} from "@src/models/vaccine";

const S3_PREFIX = "s3://";

const isS3Path = (path: string): boolean => {
  return path.startsWith(S3_PREFIX);
};

const getVaccineTypeFromUrlPath = (path: string): VaccineTypes | undefined => {
  if (
    !Object.values(VaccineContentUrlPaths).includes(
      path as VaccineContentUrlPaths,
    )
  ) {
    return undefined;
  } else {
    return vaccineUrlPathToType[path as VaccineContentUrlPaths];
  }
};

export { S3_PREFIX, isS3Path, getVaccineTypeFromUrlPath };
