import CardLink from "@src/app/_components/nhs-app/CardLink";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, VACCINES_FOR_ALL_AGES_PAGE } from "@src/app/constants";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
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
            title={`${VaccineInfo[VaccineType.RSV].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.RSV.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.SHINGLES].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.SHINGLES.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.PNEUMOCOCCAL].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.PNEUMOCOCCAL.urlPath}`}
          />
        </ul>

        <h2 className="nhsuk-heading-s">Vaccines for pregnancy</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-pregnancy">
          <CardLink
            title={`${VaccineInfo[VaccineType.WHOOPING_COUGH].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.WHOOPING_COUGH.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.RSV_PREGNANCY].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.RSV_PREGNANCY.urlPath}`}
          />
        </ul>

        <h2 className="nhsuk-heading-s">Vaccines for children aged 1 to 15</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-children">
          <CardLink
            title={`${VaccineInfo[VaccineType.TD_IPV_3_IN_1].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.TD_IPV_3_IN_1.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.MENACWY].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.MENACWY.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.HPV].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.HPV.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.VACCINE_4_IN_1].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.VACCINE_4_IN_1.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.MMR].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.MMR.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.MENB_CHILDREN].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.MENB_CHILDREN.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.PNEUMOCOCCAL].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.PNEUMOCOCCAL.urlPath}`}
          />
        </ul>
        <h2 className="nhsuk-heading-s">Vaccines for babies under 1 year old</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid={"vaccine-cardlinks-babies"}>
          <CardLink
            title={`${VaccineInfo[VaccineType.VACCINE_6_IN_1].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.VACCINE_6_IN_1.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.ROTAVIRUS].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.ROTAVIRUS.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.PNEUMOCOCCAL].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.PNEUMOCOCCAL.urlPath}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineType.MENB_CHILDREN].cardLinkTitle}`}
            link={`/vaccines/${VaccineInfo.MENB_CHILDREN.urlPath}`}
          />
        </ul>
      </MainContent>
    </>
  );
};

export default VaccinesForAllAges;
