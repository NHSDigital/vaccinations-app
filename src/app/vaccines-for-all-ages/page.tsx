import { AtRiskHubExpander } from "@src/app/_components/hub/AtRiskHubExpander";
import CardLink from "@src/app/_components/nhs-app/CardLink";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, VACCINES_FOR_ALL_AGES_PAGE } from "@src/app/constants";
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
          {adultVaccines.map((type) => (
            <CardLink
              key={type}
              title={VaccineInfo[type].cardLinkTitle}
              link={`/vaccines/${VaccineInfo[type].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Routine vaccines for pregnancy</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-pregnancy">
          {pregnancyVaccines.map((type) => (
            <CardLink
              key={type}
              title={VaccineInfo[type].cardLinkTitle}
              link={`/vaccines/${VaccineInfo[type].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Routine vaccines for school-aged children 4 to 16 (Reception to Year 11)</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-children-school-aged">
          {childSchoolAgedVaccines.map((type) => (
            <CardLink
              key={type}
              title={VaccineInfo[type].cardLinkTitle}
              link={`/vaccines/${VaccineInfo[type].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Routine vaccines for pre-school children under 4</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-children-preschool">
          {childPreschoolVaccines.map((type) => (
            <CardLink
              key={type}
              title={VaccineInfo[type].cardLinkTitle}
              link={`/vaccines/${VaccineInfo[type].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Routine vaccines for babies under 1 year old</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid={"vaccine-cardlinks-babies"}>
          {babyVaccines.map((type) => (
            <CardLink
              key={type}
              title={VaccineInfo[type].cardLinkTitle}
              link={`/vaccines/${VaccineInfo[type].urlPath}`}
            />
          ))}
        </ul>
      </MainContent>
    </>
  );
};

export default VaccinesForAllAges;
