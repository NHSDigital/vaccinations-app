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

// Ref: https://main--65aa76b29d00a047fe683b95.chromatic.com/?path=/docs/navigation-header--docs#header-with-account-1
const AppHeader = () => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState<boolean>(false);
  const { status } = useSession();

  useEffect(() => {
    setUserIsLoggedIn(status === "authenticated");
  }, [status]);

  if (!hasContextLoaded || isOpenInMobileApp) return null;

  return (
    <Header service={{ text: SERVICE_HEADING, href: userIsLoggedIn ? VACCINATIONS_HUB_PAGE_ROUTE : "#" }}>
      {userIsLoggedIn && (
        <Header.Account>
          <Header.AccountItem href={"#"} onClick={handleClick}>
            Log out
          </Header.AccountItem>
        </Header.Account>
      )}
    </Header>
  );
};

export default AppHeader;
