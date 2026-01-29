"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import logClientSidePageview from "@src/utils/client-side-logger-server-actions/client-side-pageview-logger";
import { ClientSidePageviewTypes } from "@src/utils/constants";
import React, { useEffect } from "react";

const SSOFailure = () => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  useEffect(() => {
    logClientSidePageview(ClientSidePageviewTypes.SSO_FAILURE_PAGEVIEW).catch(() => {
      // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
    });
  }, []);

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
