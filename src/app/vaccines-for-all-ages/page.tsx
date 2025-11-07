import CardLink from "@src/app/_components/nhs-app/CardLink";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, VACCINES_FOR_ALL_AGES_PAGE } from "@src/app/constants";
import { VaccineContentUrlPaths, VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import React, { JSX } from "react";

const VaccinesForAllAges = (): JSX.Element => {
  return (
    <>
      <title>{`${VACCINES_FOR_ALL_AGES_PAGE} - ${NHS_TITLE_SUFFIX}`}</title>
      <BackLink />
      <MainContent>
        <h1 className={"app-dynamic-page-title__heading"}>{VACCINES_FOR_ALL_AGES_PAGE}</h1>
        <p>
          Find out about vaccinations for babies, children and adults, including why they&#39;re important and how to
          get them.
        </p>

        <h2 className="nhsuk-heading-s">Vaccines for adults</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked">
          <CardLink
            title={`${VaccineInfo[VaccineTypes.RSV].cardLinkTitle}`}
            link={`/vaccines/${VaccineContentUrlPaths.RSV}`}
          />
        </ul>

        <h2 className="nhsuk-heading-s">Vaccines for pregnancy</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked">
          <CardLink
            title={`${VaccineInfo[VaccineTypes.RSV_PREGNANCY].cardLinkTitle}`}
            link={`/vaccines/${VaccineContentUrlPaths.RSV_PREGNANCY}`}
          />
        </ul>

        <h2 className="nhsuk-heading-s">Vaccines for children aged 1 to 15</h2>
        <h2 className="nhsuk-heading-s">Vaccines for babies under 1 year old</h2>
      </MainContent>
    </>
  );
};

export default VaccinesForAllAges;
