import { useEffect, useState } from "react";

const LinksInterceptor = (): null => {
  const [isOpenInNHSApp, setIsOpenInNHSApp] = useState(false);

  useEffect(() => {
    if (window.nhsapp.tools.isOpenInNHSApp()) {
      setIsOpenInNHSApp(true);
    } else {
      setIsOpenInNHSApp(false);
    }
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target && event.target instanceof Element)) return;

      const target = event.target as Element;
      const anchor: HTMLAnchorElement | null = target.closest("a");
      if (!anchor) return;

      const url = new URL(anchor.href);
      const isExternal = url.origin !== window.location.origin;

      if (isExternal && isOpenInNHSApp) {
        event.preventDefault(); // Stop default navigation
        event.stopImmediatePropagation(); // Stop other event handlers
        window.nhsapp.navigation.openBrowserOverlay(anchor.href);
      }
    };

    // the capture=true is critical, without which any click handlers maybe
    // invoked before ours and interfere with the functionality
    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, [isOpenInNHSApp]);

  return null;
};

export default LinksInterceptor;
