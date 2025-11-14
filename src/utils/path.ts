import { UrlPathFragment, VaccineTypes, vaccineUrlPathToVaccineType } from "@src/models/vaccine";

const S3_PREFIX = "s3://";

const isS3Path = (path: string): boolean => {
  return path.startsWith(S3_PREFIX);
};

const getVaccineTypeFromLowercaseString = (path: string): VaccineTypes | undefined => {
  return vaccineUrlPathToVaccineType.get(path as UrlPathFragment);
};

export { S3_PREFIX, isS3Path, getVaccineTypeFromLowercaseString };
