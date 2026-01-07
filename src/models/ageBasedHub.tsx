import HubWarningCallout from "@src/app/_components/hub/HubWarningCallout";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { JSX } from "react";

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
  styledWarningCallout?: JSX.Element;
};

// TODO: VIA-630 remove 'undefined' from the type definition below after all hubs are implemented?
const AgeBasedHubInfo: Record<AgeGroup, AgeBasedHubDetails | undefined> = {
  AGE_12_to_16: {
    heading: "Routine vaccines for children and teenagers aged 12 to 16",
    vaccines: [
      { vaccineName: VaccineType.HPV, cardLinkDescription: "School year 8" },
      { vaccineName: VaccineType.MENACWY, cardLinkDescription: "School year 9" },
      { vaccineName: VaccineType.TD_IPV_3_IN_1, cardLinkDescription: "School year 9" },
      { vaccineName: VaccineType.FLU_FOR_SCHOOL_AGED_CHILDREN, cardLinkDescription: "Reception to school year 11" },
    ],
    showPregnancyHubContent: false,
  },
  AGE_17_to_24: {
    heading: "Routine vaccines for young people aged 17 to 24",
    vaccines: [],
    showPregnancyHubContent: true,
    styledWarningCallout: (
      <HubWarningCallout
        heading={"Important"}
        content={
          <>
            <p>You can ask your GP about getting vaccines you might have missed. Make sure you&#39;ve had:</p>
            <ul style={{ marginBottom: 0 }}>
              <li>
                2 doses of the <a href={`/vaccines/${VaccineInfo[VaccineType.MMR].urlPath}`}>MMR vaccine</a> – which
                protects against measles, mumps and rubella. If you have not previously had 2 doses of MMR, you can
                still have the vaccine at any age.
              </li>
              <li>
                The completed course of{" "}
                <a href={`/vaccines/${VaccineInfo[VaccineType.TD_IPV_3_IN_1].urlPath}`}>Td/IPV vaccine</a> (also called
                the 3-in-1 teenage booster) - which protects against tetanus, diphtheria and polio. You can ask for this
                at any age.
              </li>
              <li>
                The <a href={`/vaccines/${VaccineInfo[VaccineType.HPV].urlPath}`}>HPV vaccine</a> – which helps protect
                against genital warts and cancers caused by the human papilloma virus (HPV), such as cervical cancer.
                You can ask for this until your 25th birthday.
              </li>
              <li>
                The <a href={`/vaccines/${VaccineInfo[VaccineType.MENACWY].urlPath}`}>MenACWY vaccine</a> – which
                protects against serious infections including meningitis. You can ask for this until your 25th birthday.
              </li>
            </ul>
          </>
        }
      />
    ),
  },
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
  AGE_81_PLUS: {
    heading: "Adults aged 81 and over should get these routine vaccines",
    vaccines: [
      { vaccineName: VaccineType.PNEUMOCOCCAL, cardLinkDescription: "65 years and over" },
      { vaccineName: VaccineType.FLU_FOR_ADULTS, cardLinkDescription: "65 years and over" },
      { vaccineName: VaccineType.RSV, cardLinkDescription: "75 years and over" },
      { vaccineName: VaccineType.COVID_19, cardLinkDescription: "75 years and over" },
    ],
    showPregnancyHubContent: false,
  },
  UNKNOWN_AGE_GROUP: undefined,
};

export { AgeGroup, AgeBasedHubInfo };
