"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import { useEffect } from "react";

const SessionTimeout = () => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  useEffect(() => {
    if (hasContextLoaded && isOpenInMobileApp) {
      window.nhsapp.navigation.goToHomePage();
    }
  }, [isOpenInMobileApp, hasContextLoaded]);

  if (!hasContextLoaded || isOpenInMobileApp) return null;

  return (
    <>
      <title>{`You have been logged out - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>
      <MainContent>
        <h1>You have been logged out</h1>
        <p>
          For security reasons, you&#39;re automatically logged out if you have not used the service for 10 minutes.
        </p>
        <p>If you were entering information, it has not been saved and you will need to re-enter it.</p>
        <p>To continue, close the tab which has the service open and log in again.</p>
      </MainContent>
    </>
  );
};

export default SessionTimeout;
