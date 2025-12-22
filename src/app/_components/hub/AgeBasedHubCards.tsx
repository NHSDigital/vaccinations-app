import CardLinkWithDescription from "@src/app/_components/nhs-app/CardLinkWithDescription";
import { AgeBasedHubDetails, AgeBasedHubInfo, AgeGroup } from "@src/models/ageBasedHub";
import { VaccineInfo } from "@src/models/vaccine";
import React, { JSX } from "react";

type AgeBasedHubProps = {
  ageGroup: AgeGroup;
};

const AgeBasedHubCards = ({ ageGroup }: AgeBasedHubProps): JSX.Element => {
  const hubInfoForAgeGroup: AgeBasedHubDetails | undefined = AgeBasedHubInfo[ageGroup];

  // TODO VIA-161 Age-Based Hub epic: hubInfo info will be undefined for the age ranges we have not implemented yet
  //  This is expected for now; fail gracefully and do not render anything
  //  This boolean check can likely be removed once all ages are implemented
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
