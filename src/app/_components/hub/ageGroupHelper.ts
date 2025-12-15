import { AgeGroup } from "@src/models/ageBasedHub";

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

export { getAgeGroup };
