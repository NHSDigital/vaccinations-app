"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import { SERVICE_HEADING, VACCINATIONS_HUB_PAGE_ROUTE } from "@src/app/constants";
import { userLogout } from "@src/utils/auth/user-logout";
import { useSession } from "next-auth/react";
import { Header } from "nhsuk-react-components";
import React, { useEffect, useState } from "react";

const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  userLogout();
};

const AppHeader = () => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState<boolean>(false);
  const { status } = useSession();

  useEffect(() => {
    setUserIsLoggedIn(status === "authenticated");
  }, [status]);

  if (!hasContextLoaded || isOpenInMobileApp) return null;

  return (
    <Header transactional>
      <Header.Container>
        {userIsLoggedIn && (
          <>
            <Header.Logo href={`${VACCINATIONS_HUB_PAGE_ROUTE}`} />
            <Header.ServiceName href={`${VACCINATIONS_HUB_PAGE_ROUTE}`}>{SERVICE_HEADING}</Header.ServiceName>
            <div className={"nhsuk-header__transactional-service-name appHeaderLogoutContainer"}>
              <a className="nhsuk-link--reverse" href="#" onClick={handleClick}>
                Log out
              </a>
            </div>
          </>
        )}

        {!userIsLoggedIn && (
          <>
            <Header.Logo href="#" />
            <Header.ServiceName href="#">{SERVICE_HEADING}</Header.ServiceName>
          </>
        )}
      </Header.Container>
    </Header>
  );
};

export default AppHeader;
