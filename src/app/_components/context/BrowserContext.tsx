"use client";

import React, { JSX, ReactNode, createContext, useContext, useEffect, useState } from "react";

interface BrowserContextType {
  hasContextLoaded: boolean;
  isOpenInMobileApp: boolean;
}

const BrowserContext = createContext<BrowserContextType>({
  hasContextLoaded: false,
  isOpenInMobileApp: true,
});

const useBrowserContext = (): BrowserContextType => useContext(BrowserContext);

const BrowserContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [browserContext, setBrowserContext] = useState<BrowserContextType>({
    hasContextLoaded: false,
    isOpenInMobileApp: true,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isOpenInMobile: boolean = window.nhsapp?.tools?.isOpenInNHSApp?.() ?? false;
      setBrowserContext({
        hasContextLoaded: true,
        isOpenInMobileApp: isOpenInMobile,
      });
    }
  }, []);

  return <BrowserContext.Provider value={browserContext}>{children}</BrowserContext.Provider>;
};

export { useBrowserContext, BrowserContextProvider };
