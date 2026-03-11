"use client";

import React, { JSX, ReactNode, createContext, useContext, useSyncExternalStore } from "react";

interface BrowserContextType {
  hasContextLoaded: boolean;
  isOpenInMobileApp: boolean;
}

const BrowserContext = createContext<BrowserContextType>({
  hasContextLoaded: false,
  isOpenInMobileApp: true,
});

const useBrowserContext = (): BrowserContextType => useContext(BrowserContext);

const noopSubscribe = () => () => {};

const BrowserContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const hasContextLoaded = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const isOpenInMobileApp = useSyncExternalStore(
    noopSubscribe,
    () => window.nhsapp?.tools.isOpenInNHSApp() ?? true,
    () => true,
  );

  return (
    <BrowserContext.Provider value={{ hasContextLoaded, isOpenInMobileApp }}>
      {children}
    </BrowserContext.Provider>
  );
};

export { useBrowserContext, BrowserContextProvider };
