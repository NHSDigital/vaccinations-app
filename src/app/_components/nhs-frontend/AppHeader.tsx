"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import { SERVICE_HEADING, VACCINATIONS_HUB_PAGE_ROUTE } from "@src/app/constants";
import { Header } from "nhsuk-react-components";
import React from "react";

const AppHeader = () => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  if (!hasContextLoaded || isOpenInMobileApp) return null;

  return (
    <Header transactional>
      <Header.Container>
        <Header.Logo href={`${VACCINATIONS_HUB_PAGE_ROUTE}`} />
        <Header.ServiceName href={`${VACCINATIONS_HUB_PAGE_ROUTE}`}>{SERVICE_HEADING}</Header.ServiceName>
      </Header.Container>
    </Header>
  );
};

export default AppHeader;
