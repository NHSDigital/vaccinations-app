"use client";

import {
  SERVICE_HEADING,
  VACCINATIONS_HUB_PAGE_ROUTE,
} from "@src/app/constants";
import { Header } from "nhsuk-react-components";
import React, { useEffect, useState } from "react";

const AppHeader = () => {
  const [hideHeader, setHideHeader] = useState(true);

  useEffect(() => {
    setHideHeader(window.nhsapp.tools.isOpenInNHSApp());
  }, []);

  if (hideHeader) return null;

  return (
    <Header transactional>
      <Header.Container>
        <Header.Logo href={`${VACCINATIONS_HUB_PAGE_ROUTE}`} />
        <Header.ServiceName href={`${VACCINATIONS_HUB_PAGE_ROUTE}`}>
          {SERVICE_HEADING}
        </Header.ServiceName>
      </Header.Container>
    </Header>
  );
};

export default AppHeader;
