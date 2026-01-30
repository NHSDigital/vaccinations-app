"use client";

import { BrowserContextProvider } from "@src/app/_components/context/BrowserContext";
import { NavigationProvider } from "@src/app/_components/context/NavigationContext";
import { InactivityDialog } from "@src/app/_components/inactivity/InactivityDialog";
import LinksInterceptor from "@src/app/_components/interceptor/LinksInterceptor";
import AppFooter from "@src/app/_components/nhs-frontend/AppFooter";
import AppHeader from "@src/app/_components/nhs-frontend/AppHeader";
import SkipLink from "@src/app/_components/nhs-frontend/SkipLink";
import { SessionProvider } from "next-auth/react";
import React from "react";

export function ClientProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  // This is the session polling time on the client side,
  // so that the client can react to server side session expiry.
  // The value should be less than the time to warning dialog,
  // to ensure that the warning dialog is only shown when a user is authenticated
  // But not too less to avoid frequent polling.
  // One needs to also account for the polling request latency (assume 5 sec).
  // Update: setting to 60s to mitigate APIM token expiry issue, see VIA-254
  const SESSION_REFETCH_SECONDS = 60;

  return (
    <BrowserContextProvider>
      <LinksInterceptor />
      <SkipLink />
      <SessionProvider refetchInterval={SESSION_REFETCH_SECONDS}>
        <NavigationProvider>
          <AppHeader />
          <InactivityDialog />
          <div className="nhsuk-width-container">{children}</div>
          <AppFooter />
        </NavigationProvider>
      </SessionProvider>
    </BrowserContextProvider>
  );
}
