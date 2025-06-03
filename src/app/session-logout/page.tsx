"use client";

import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { useEffect } from "react";

const SessionLogout = () => {
  useEffect(() => {
    if (window.nhsapp.tools.isOpenInNHSApp()) {
      window.nhsapp.navigation.goToHomePage();
    }
  }, []);

  return (
    <MainContent>
      <title>You have logged out</title>
      <h1>You have logged out</h1>
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

export default SessionLogout;
