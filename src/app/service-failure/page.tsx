"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import React from "react";

const ServiceFailure = () => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  return (
    <>
      <title>{`There is a problem with the service - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <BackToNHSAppLink />
      <MainContent>
        <h1>There is a problem with the service</h1>
        <p>This maybe a temporary problem.</p>
        <p>
          {hasContextLoaded && (
            <>
              {isOpenInMobileApp ? "Go back and try logging in again." : "Close this tab and try logging in again."}
              {" If you cannot login, try again later."}
            </>
          )}
        </p>
        <p>
          For urgent medical advice, go to{" "}
          <a href={"https://111.nhs.uk/"} target={"_blank"} rel={"noopener"}>
            111.nhs.uk
          </a>{" "}
          or call 111.
        </p>
      </MainContent>
    </>
  );
};

export default ServiceFailure;
