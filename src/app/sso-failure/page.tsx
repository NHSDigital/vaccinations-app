"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import React from "react";

const SSOFailure = () => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  return (
    <>
      <title>{`There is a problem - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <BackToNHSAppLink />
      <MainContent>
        <h1 className={"nhsuk-heading-xl nhsuk-u-margin-bottom-5"}>There is a problem</h1>
        <p>There was an issue with NHS login. This may be a temporary problem.</p>
        <p>
          {hasContextLoaded && (
            <>
              {isOpenInMobileApp ? "Go back and try logging in again." : "Close this tab and try logging in again."}
              {" If you cannot log in, try again later."}
            </>
          )}
        </p>
      </MainContent>
    </>
  );
};

export default SSOFailure;
