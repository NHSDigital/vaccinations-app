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
        {hubInfoForAgeGroup.vaccines.length > 0 ? (
          <ul className="nhsapp-cards nhsapp-cards--stacked">
            {hubInfoForAgeGroup.vaccines.map((ageSpecificVaccineCardDetails) => (
              <CardLinkWithDescription
                key={ageSpecificVaccineCardDetails.vaccineName}
                title={VaccineInfo[ageSpecificVaccineCardDetails.vaccineName].cardLinkTitle}
                description={ageSpecificVaccineCardDetails.cardLinkDescription}
                link={`/vaccines/${VaccineInfo[ageSpecificVaccineCardDetails.vaccineName].urlPath}`}
              />
            ))}
          </ul>
        ) : (
          <>
            <p>There are no routine vaccines for your age group.</p>
            <p>
              People in this age group should make sure they&#39;re up to date with their NHS vaccinations. If you think
              you&#39;ve missed any vaccines, contact your GP to catch up.
            </p>
          </>
        )}
      </>
    );
  } else return <></>;
};

export { AgeBasedHubCards };
