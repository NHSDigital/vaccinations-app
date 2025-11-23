import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import CardLink from "@src/app/_components/nhs-app/CardLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import Link from "next/link";
import React from "react";

const VaccinationsHub = () => {
  return (
    <>
      <title>{`${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>
      <BackToNHSAppLink />
      <MainContent>
        <h1 className={"app-dynamic-page-title__heading"}>{SERVICE_HEADING}</h1>
        <h2 className="nhsuk-heading-s">Vaccines if you&#39;re pregnant</h2>
        <p>Some vaccines are recommended during pregnancy to protect the health of you and your baby.</p>
        <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid={"vaccine-cardlinks-adults"}>
          <CardLink title={"Vaccines during pregnancy"} link={"/vaccines-during-pregnancy"} />
        </ul>
        <Link href={"/vaccines-for-all-ages"} className={"nhsuk-button nhsuk-button--secondary"}>
          View vaccines for all ages
        </Link>
      </MainContent>
    </>
  );
};

export default VaccinationsHub;
