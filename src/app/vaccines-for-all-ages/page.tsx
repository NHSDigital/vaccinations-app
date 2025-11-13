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
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid={"vaccine-cardlinks-adults"}>
          <CardLink
            title={`${VaccineInfo[VaccineTypes.RSV].cardLinkTitle}`}
            link={`/vaccines/${VaccineContentUrlPaths.RSV}`}
          />
        </ul>

        <h2 className="nhsuk-heading-s">Vaccines for pregnancy</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-pregnancy">
          <CardLink
            title={`${VaccineInfo[VaccineTypes.RSV_PREGNANCY].cardLinkTitle}`}
            link={`/vaccines/${VaccineContentUrlPaths.RSV_PREGNANCY}`}
          />
        </ul>

        <h2 className="nhsuk-heading-s">Vaccines for children aged 1 to 15</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-children">
          <CardLink
            title={`${VaccineInfo[VaccineTypes.TD_IPV_3_IN_1].cardLinkTitle}`}
            link={`/vaccines/${VaccineContentUrlPaths.TD_IPV_3_IN_1}`}
          />
        </ul>
        <h2 className="nhsuk-heading-s">Vaccines for babies under 1 year old</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid={"vaccine-cardlinks-babies"}>
          <CardLink
            title={`${VaccineInfo[VaccineTypes.VACCINE_6_IN_1].cardLinkTitle}`}
            link={`/vaccines/${VaccineContentUrlPaths.VACCINE_6_IN_1}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineTypes.ROTAVIRUS].cardLinkTitle}`}
            link={`/vaccines/${VaccineContentUrlPaths.ROTAVIRUS}`}
          />
        </ul>
      </MainContent>
    </>
  );
};

export default VaccinesForAllAges;
