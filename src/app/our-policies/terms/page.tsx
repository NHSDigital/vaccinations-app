"use client";

import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import React from "react";

const TermsOfUse = () => {
  return (
    <>
      <title>{`Terms of use - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <BackLink />
      <MainContent>
        <h1>Terms of use</h1>
      </MainContent>
    </>
  );
};

export default TermsOfUse;
