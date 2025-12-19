import CardLinkWithDescription from "@src/app/_components/nhs-app/CardLinkWithDescription";
import { AgeBasedHubDetails, AgeBasedHubInfo, AgeGroup } from "@src/models/ageBasedHub";
import { VaccineInfo } from "@src/models/vaccine";
import React, { JSX } from "react";

type AgeBasedHubProps = {
  ageGroup: AgeGroup;
};

const AgeBasedHubCards = ({ ageGroup }: AgeBasedHubProps): JSX.Element => {
  const hubInfoForAgeGroup: AgeBasedHubDetails | undefined = AgeBasedHubInfo[ageGroup];

  if (hubInfoForAgeGroup) {
    return (
      <>
        <h2 className="nhsuk-heading-s">{hubInfoForAgeGroup.heading}</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked">
          {hubInfoForAgeGroup.vaccines.map((ageSpecificVaccineCardDetails) => (
            <CardLinkWithDescription
              key={ageSpecificVaccineCardDetails.vaccineName}
              title={VaccineInfo[ageSpecificVaccineCardDetails.vaccineName].displayName.titleCase}
              description={ageSpecificVaccineCardDetails.cardLinkDescription}
              link={`/vaccines/${VaccineInfo[ageSpecificVaccineCardDetails.vaccineName].urlPath}`}
            />
          ))}
        </ul>
      </>
    );
  } else return <></>;
};

export { AgeBasedHubCards };
