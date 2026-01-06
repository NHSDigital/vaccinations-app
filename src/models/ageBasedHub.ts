import { VaccineType } from "@src/models/vaccine";

enum AgeGroup {
  AGE_12_to_16 = "AGE_12_to_16",
  AGE_17_to_24 = "AGE_17_to_24",
  AGE_25_to_64 = "AGE_25_to_64",
  AGE_65_to_74 = "AGE_65_to_74",
  AGE_75_to_80 = "AGE_75_to_80",
  AGE_81_PLUS = "AGE_81_PLUS",
  UNKNOWN_AGE_GROUP = "UNKNOWN_AGE_GROUP",
}

type AgeSpecificVaccineCardDetails = {
  vaccineName: VaccineType;
  cardLinkDescription: string;
};

export type AgeBasedHubDetails = {
  heading: string;
  vaccines: AgeSpecificVaccineCardDetails[];
  showPregnancyHubContent: boolean;
};

// TODO: VIA-630 remove 'undefined' from the type definition below after all hubs are implemented?
const AgeBasedHubInfo: Record<AgeGroup, AgeBasedHubDetails | undefined> = {
  AGE_12_to_16: undefined,
  AGE_17_to_24: undefined,
  AGE_25_to_64: undefined,
  AGE_65_to_74: {
    heading: "Adults aged 65 to 74 should get these routine vaccines",
    vaccines: [
      { vaccineName: VaccineType.PNEUMOCOCCAL, cardLinkDescription: "65 years and over" },
      { vaccineName: VaccineType.FLU_FOR_ADULTS, cardLinkDescription: "65 years and over" },
      { vaccineName: VaccineType.SHINGLES, cardLinkDescription: "65 to 67 and 70 to 79 years" },
    ],
    showPregnancyHubContent: false,
  },
  AGE_75_to_80: {
    heading: "Adults aged 75 to 80 should get these routine vaccines",
    vaccines: [
      { vaccineName: VaccineType.PNEUMOCOCCAL, cardLinkDescription: "65 years and over" },
      { vaccineName: VaccineType.FLU_FOR_ADULTS, cardLinkDescription: "65 years and over" },
      { vaccineName: VaccineType.SHINGLES, cardLinkDescription: "65 to 67 and 70 to 79 years" },
      { vaccineName: VaccineType.RSV, cardLinkDescription: "75 years and over" },
      { vaccineName: VaccineType.COVID_19, cardLinkDescription: "75 years and over" },
    ],
    showPregnancyHubContent: false,
  },
  AGE_81_PLUS: undefined,
  UNKNOWN_AGE_GROUP: undefined,
};

export { AgeGroup, AgeBasedHubInfo };
