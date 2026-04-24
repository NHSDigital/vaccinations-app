"use client";

import { buildDigitalData } from "@src/app/_components/analytics/digitalDataConfig";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const toSafeInlineScriptJson = (value: unknown): string => {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
};

export const DigitalDataScript = () => {
  const pathname = usePathname();
  const digitalData = buildDigitalData(pathname);
  const digitalDataScript = `window.digitalData = ${toSafeInlineScriptJson(digitalData)};`;

  // Keep window.digitalData current on every client-side navigation
  useEffect(() => {
    window.digitalData = buildDigitalData(pathname);
    document.dispatchEvent(new CustomEvent("spa:pageview"));
  }, [pathname]);

  return <script id="digital-data-script" dangerouslySetInnerHTML={{ __html: digitalDataScript }} />;
};
