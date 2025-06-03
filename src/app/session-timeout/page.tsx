"use client";

import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { useEffect } from "react";

const SessionTimeout = () => {
  useEffect(() => {
    if (window.nhsapp.tools.isOpenInNHSApp()) {
      window.nhsapp.navigation.goToHomePage();
    }
  }, []);

  return (
    <MainContent>
      <title>You have been logged out</title>
      <h1>You have been logged out</h1>
      <p>
        For security reasons, you&#39;re automatically logged out if you have
        not used the service for 10 minutes.
      </p>
      <p>
        If you were entering information, it has not been saved and you will
        need to re-enter it.
      </p>
      <p>
        To continue, close the tab which has the service open and login again.
      </p>
    </MainContent>
  );
};

export default SessionTimeout;
