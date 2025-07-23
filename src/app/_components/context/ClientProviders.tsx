"use client";

import { BrowserContextProvider } from "@src/app/_components/context/BrowserContext";
import { InactivityDialog } from "@src/app/_components/inactivity/InactivityDialog";
import LinksInterceptor from "@src/app/_components/interceptor/LinksInterceptor";
import AppFooter from "@src/app/_components/nhs-frontend/AppFooter";
import AppHeader from "@src/app/_components/nhs-frontend/AppHeader";
import SkipLink from "@src/app/_components/nhs-frontend/SkipLink";
import { WARNING_TIME_MS } from "@src/utils/auth/inactivity-timer";
import { SessionProvider } from "next-auth/react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // This is the session polling time on the client side,
  // so that the client can react to server side session expiry.
  // The value should be less than the time to warning dialog,
  // to ensure that the warning dialog is only shown when a user is authenticated
  // But not too less to avoid frequent polling.
  // One needs to also account for the polling request latency (assume 5 sec).
  const SESSION_REFETCH_SECONDS = Math.floor(0.9 * (WARNING_TIME_MS / 1000)) - 5;

  return (
    <BrowserContextProvider>
      <LinksInterceptor />
      <SkipLink />
      <AppHeader />
      <SessionProvider refetchInterval={SESSION_REFETCH_SECONDS}>
        <InactivityDialog />
        <div className="nhsuk-width-container">{children}</div>
      </SessionProvider>
      <AppFooter />
    </BrowserContextProvider>
  );
}
