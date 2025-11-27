import CardLink from "@src/app/_components/nhs-app/CardLink";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, VACCINES_FOR_ALL_AGES_PAGE } from "@src/app/constants";
import { VaccineInfo, adultVaccines, babyVaccines, childVaccines, pregnancyVaccines } from "@src/models/vaccine";
import React, { JSX } from "react";

const VaccinesForAllAges = (): JSX.Element => {
  return (
    <>
      <title>{`${VACCINES_FOR_ALL_AGES_PAGE} - ${NHS_TITLE_SUFFIX}`}</title>
      <BackLink />
      <MainContent>
        <h1 className={"nhsuk-heading-xl nhsuk-u-margin-bottom-3"}>{VACCINES_FOR_ALL_AGES_PAGE}</h1>
        <p>
          Find out about vaccinations for babies, children and adults, including why they&#39;re important and how to
          get them.
        </p>

        <h2 className="nhsuk-heading-s">Vaccines for adults</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid={"vaccine-cardlinks-adults"}>
          {adultVaccines.map((type) => (
            <CardLink
              key={type}
              title={VaccineInfo[type].cardLinkTitle}
              link={`/vaccines/${VaccineInfo[type].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Vaccines for pregnancy</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-pregnancy">
          {pregnancyVaccines.map((type) => (
            <CardLink
              key={type}
              title={VaccineInfo[type].cardLinkTitle}
              link={`/vaccines/${VaccineInfo[type].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Vaccines for children aged 1 to 15</h2>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid="vaccine-cardlinks-children">
          {childVaccines.map((type) => (
            <CardLink
              key={type}
              title={VaccineInfo[type].cardLinkTitle}
              link={`/vaccines/${VaccineInfo[type].urlPath}`}
            />
          ))}
        </ul>

        <h2 className="nhsuk-heading-s">Vaccines for babies under 1 year old</h2>
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
