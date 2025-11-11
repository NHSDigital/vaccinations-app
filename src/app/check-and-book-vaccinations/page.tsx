import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import React from "react";

const VaccinationsHub = () => {
  return (
    <>
      <title>{`${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>
      <h1 className={"app-dynamic-page-title__heading"}>{SERVICE_HEADING}</h1>
    </>
  );
};

export default VaccinationsHub;
