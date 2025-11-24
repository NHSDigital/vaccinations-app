import CardLinkWithDescription from "@src/app/_components/nhs-app/CardLinkWithDescription";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, VACCINES_FOR_PREGNANT_PAGE } from "@src/app/constants";
import Link from "next/link";
import React, { JSX } from "react";

const VaccinesDuringPregnancy = (): JSX.Element => {
  return (
    <>
      <title>{`${VACCINES_FOR_PREGNANT_PAGE} - ${NHS_TITLE_SUFFIX}`}</title>
      <BackLink />
      <MainContent>
        <h1 className={"app-dynamic-page-title__heading"}>{VACCINES_FOR_PREGNANT_PAGE}</h1>
        <ul className="nhsapp-cards nhsapp-cards--stacked">
          <CardLinkWithDescription
            title={"Whooping cough (Pertussis)"}
            description={"Around 20 weeks"}
            link={"/vaccines/whooping-cough-vaccination"}
          />
          <CardLinkWithDescription
            title={"RSV in pregnancy"}
            description={"From 28 weeks"}
            link={"/vaccines/rsv-pregnancy"}
          />
        </ul>
        <Link href={"/vaccines-for-all-ages"} className={"nhsuk-button nhsuk-button--secondary"}>
          View vaccines for all ages
        </Link>
      </MainContent>
    </>
  );
};

export default VaccinesDuringPregnancy;
