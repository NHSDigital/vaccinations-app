"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const handleClick = (router: AppRouterInstance) => {
  router.back();
};

// Ref: https://service-manual.nhs.uk/design-system/components/back-link
const BackLink = () => {
  const router = useRouter();
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  useEffect(() => {
    if (hasContextLoaded && isOpenInMobileApp) {
      window.nhsapp.navigation.setBackAction(() => handleClick(router));
    }
  }, [hasContextLoaded, isOpenInMobileApp, router]);

  return (
    <a
      className="nhsuk-back-link"
      href="#"
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        handleClick(router);
      }}
    >
      Back
    </a>
  );
};

export default BackLink;
