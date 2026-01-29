"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import logClientSidePageview from "@src/utils/client-side-logger-server-actions/client-side-pageview-logger";
import { ClientSidePageviewTypes } from "@src/utils/constants";
import React, { useEffect } from "react";

const ServiceFailure = () => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  useEffect(() => {
    logClientSidePageview(ClientSidePageviewTypes.SERVICE_FAILURE_PAGEVIEW).catch(() => {
      // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
    });
  }, []);

  return (
    <>
      <title>{`There is a problem with the service - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <BackToNHSAppLink />
      <MainContent>
        <h1 className={"nhsuk-heading-xl nhsuk-u-margin-bottom-5"}>There is a problem with the service</h1>
        <p>This may be a temporary problem.</p>
        <p>
          {hasContextLoaded && (
            <>
              {isOpenInMobileApp ? "Go back and try logging in again." : "Close this tab and try logging in again."}
              {" If you cannot log in, try again later."}
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
