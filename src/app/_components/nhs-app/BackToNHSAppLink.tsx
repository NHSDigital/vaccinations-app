"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import React, { useEffect } from "react";

const handleClick = () => {
  if (typeof window === "undefined" || !window.nhsapp) return;

  const servicesPage = window.nhsapp.navigation.AppPage.SERVICES;
  window.nhsapp.navigation.goToPage(servicesPage);
};

const BackToNHSAppLink = () => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  useEffect(() => {
    if (hasContextLoaded && isOpenInMobileApp && window.nhsapp) {
      window.nhsapp.navigation.setBackAction(handleClick);
    }
  }, [hasContextLoaded, isOpenInMobileApp]);

  if (!hasContextLoaded || !isOpenInMobileApp) return null;

  return (
    <a
      className="nhsuk-back-link"
      href="#"
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        handleClick();
      }}
    >
      Back
    </a>
  );
};

export default BackToNHSAppLink;
