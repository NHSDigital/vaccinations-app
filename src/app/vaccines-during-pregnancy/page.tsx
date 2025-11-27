import CardLinkWithDescription from "@src/app/_components/nhs-app/CardLinkWithDescription";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, VACCINES_FOR_PREGNANT_PAGE } from "@src/app/constants";
import { VaccineInfo, pregnancyVaccines } from "@src/models/vaccine";
import Link from "next/link";
import React, { JSX } from "react";

const VaccinesDuringPregnancy = (): JSX.Element => {
  return (
    <>
      <title>{`${VACCINES_FOR_PREGNANT_PAGE} - ${NHS_TITLE_SUFFIX}`}</title>
      <BackLink />
      <MainContent>
        <h1 className={"nhsuk-heading-xl nhsuk-u-margin-bottom-5"}>{VACCINES_FOR_PREGNANT_PAGE}</h1>
        <ul className="nhsapp-cards nhsapp-cards--stacked">
          {pregnancyVaccines.map((type) => (
            <CardLinkWithDescription
              key={type}
              title={VaccineInfo[type].cardLinkTitle}
              description={VaccineInfo[type].cardLinkDescription}
              link={`/vaccines/${VaccineInfo[type].urlPath}`}
            />
          ))}
        </ul>
        <Link href={"/vaccines-for-all-ages"} className={"nhsuk-button nhsuk-button--secondary"}>
          View vaccines for all ages
        </Link>
      </MainContent>
    </>
  );
};

export default VaccinesDuringPregnancy;
