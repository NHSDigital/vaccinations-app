"use client";

import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import React from "react";

const SSOFailure = () => {
  return (
    <>
      <title>{`There is a problem - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <BackToNHSAppLink />
      <MainContent>
        <h1>There is a problem</h1>
        <p>
          There was an issue with NHS login. This maybe a temporary problem.
        </p>
        <p>
          Go back and try logging in again. If you cannot login, try again
          later.
        </p>
      </MainContent>
    </>
  );
};

export default SSOFailure;
