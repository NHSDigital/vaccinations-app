"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import { useEffect } from "react";

const LinksInterceptor = (): null => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target && event.target instanceof Element)) return;

      const target: Element = event.target;
      const anchor: HTMLAnchorElement | null = target.closest("a");
      if (!anchor) return;

      const isExternal = anchor.origin !== window.location.origin;

      if (isExternal && hasContextLoaded && isOpenInMobileApp) {
        event.preventDefault(); // Stop default navigation
        event.stopImmediatePropagation(); // Stop other event handlers
        window.nhsapp.navigation.openBrowserOverlay(anchor.href);
      }
    };

    // the capture=true is critical, without which any click handlers maybe
    // invoked before ours and interfere with the functionality
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [hasContextLoaded, isOpenInMobileApp]);

  return null;
};

export default LinksInterceptor;
