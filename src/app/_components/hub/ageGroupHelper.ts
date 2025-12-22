import { AgeGroup } from "@src/models/ageBasedHub";
import { calculateAge } from "@src/utils/date";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({
  module: "age-group-helper",
});

const getAgeGroup = (age: number): AgeGroup => {
  if (12 <= age && age <= 16) {
    return AgeGroup.AGE_12_to_16;
  }
  if (17 <= age && age <= 24) {
    return AgeGroup.AGE_17_to_24;
  }
  if (25 <= age && age <= 64) {
    return AgeGroup.AGE_25_to_64;
  }
  if (65 <= age && age <= 74) {
    return AgeGroup.AGE_65_to_74;
  }
  if (75 <= age && age <= 80) {
    return AgeGroup.AGE_75_to_80;
  }
  if (81 <= age) {
    return AgeGroup.AGE_81_PLUS;
  } else return AgeGroup.UNKNOWN_AGE_GROUP;
};

const getAgeGroupOfUser = (dateOfBirth: string): AgeGroup => {
  let ageGroupOfUser;

  try {
    const age = calculateAge(dateOfBirth);
    ageGroupOfUser = getAgeGroup(age);
  } catch (error) {
    ageGroupOfUser = AgeGroup.UNKNOWN_AGE_GROUP;
    const errorMessage = error instanceof Error && error?.message != undefined ? error.message : "unknown error";
    const errorCause = error instanceof Error ? error.cause : "";
    log.error(
      { error: { message: errorMessage, cause: errorCause } },
      "User data error; unable to determine age of user",
    );
  }
  return ageGroupOfUser;
};

export { getAgeGroup, getAgeGroupOfUser };
