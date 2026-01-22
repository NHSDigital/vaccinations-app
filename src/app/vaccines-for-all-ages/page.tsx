import { FeedbackBanner } from "@src/app/_components/feedback/FeedbackBanner";
import { AtRiskHubExpander } from "@src/app/_components/hub/AtRiskHubExpander";
import CardLinkWithDescription from "@src/app/_components/nhs-app/CardLinkWithDescription";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { HUB_FEEDBACK_REFERRER_ID, NHS_TITLE_SUFFIX, VACCINES_FOR_ALL_AGES_PAGE } from "@src/app/constants";
import {
  VaccineInfo,
  adultVaccines,
  babyVaccines,
  childPreschoolVaccines,
  childSchoolAgedVaccines,
  pregnancyVaccines,
} from "@src/models/vaccine";
import React, { JSX } from "react";

const VaccinesForAllAges = (): JSX.Element => {
  return (
    <>
      <title>{`${VACCINES_FOR_ALL_AGES_PAGE} - ${NHS_TITLE_SUFFIX}`}</title>

      <FeedbackBanner referrer={HUB_FEEDBACK_REFERRER_ID} />
      <BackLink />
      <MainContent>
        <h1 className={"nhsuk-heading-xl nhsuk-u-margin-bottom-3"}>{VACCINES_FOR_ALL_AGES_PAGE}</h1>
        <p>
          It&#39;s important that vaccines are given on time for the best protection, but if you or your child missed a
          vaccine, contact your GP to catch up.
        </p>

        <AtRiskHubExpander />

        <h2 className="nhsuk-heading-s">Routine vaccines for adults</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid={"vaccine-cardlinks-adults"}>
          {adultVaccines.map((cardDetails) => (
            <CardLinkWithDescription
              key={cardDetails.vaccineName}
              title={VaccineInfo[cardDetails.vaccineName].cardLinkTitle}
              description={cardDetails.cardLinkDescription}
              link={`/vaccines/${VaccineInfo[cardDetails.vaccineName].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Routine vaccines for pregnancy</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-pregnancy">
          {pregnancyVaccines.map((cardDetails) => (
            <CardLinkWithDescription
              key={cardDetails.vaccineName}
              title={VaccineInfo[cardDetails.vaccineName].cardLinkTitle}
              description={cardDetails.cardLinkDescription}
              link={`/vaccines/${VaccineInfo[cardDetails.vaccineName].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Routine vaccines for school-aged children 4 to 16 (Reception to Year 11)</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-children-school-aged">
          {childSchoolAgedVaccines.map((cardDetails) => (
            <CardLinkWithDescription
              key={cardDetails.vaccineName}
              title={VaccineInfo[cardDetails.vaccineName].cardLinkTitle}
              description={cardDetails.cardLinkDescription}
              link={`/vaccines/${VaccineInfo[cardDetails.vaccineName].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Routine vaccines for pre-school children under 4</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-children-preschool">
          {childPreschoolVaccines.map((cardDetails) => (
            <CardLinkWithDescription
              key={cardDetails.vaccineName}
              title={VaccineInfo[cardDetails.vaccineName].cardLinkTitle}
              description={cardDetails.cardLinkDescription}
              link={`/vaccines/${VaccineInfo[cardDetails.vaccineName].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Routine vaccines for babies under 1 year old</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid={"vaccine-cardlinks-babies"}>
          {babyVaccines.map((cardDetails) => (
            <CardLinkWithDescription
              key={cardDetails.vaccineName}
              title={VaccineInfo[cardDetails.vaccineName].cardLinkTitle}
              description={cardDetails.cardLinkDescription}
              link={`/vaccines/${VaccineInfo[cardDetails.vaccineName].urlPath}`}
            />
          ))}
        </ul>
      </MainContent>
    </>
  );
};

export default VaccinesForAllAges;
