import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
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
        <Link href={"/vaccines-for-all-ages"} className={"nhsuk-button nhsuk-button--secondary"}>
          View vaccines for all ages
        </Link>
      </MainContent>
    </>
  );
};

export default VaccinationsHub;
