"use client";

import { InactivityDialog } from "@src/app/_components/inactivity/InactivityDialog";
import AppFooter from "@src/app/_components/nhs-frontend/AppFooter";
import AppHeader from "@src/app/_components/nhs-frontend/AppHeader";
import SkipLink from "@src/app/_components/nhs-frontend/SkipLink";
import { WARNING_TIME_MS } from "@src/utils/auth/inactivity-timer";
import Script from "next/script";
import React, { JSX } from "react";
import "@public/css/nhsuk-9.6.1.min.css";
import "@public/css/nhsapp-3.1.0.min.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  // This is the session polling time on the client side,
  // so that the client can react to server side session expiry.
  // The value should be less than the time to warning dialog,
  // to ensure that the warning dialog is only shown when user is authenticated
  // But not too less to avoid frequent polling.
  // One needs to also account for the polling request latency (assume 5 sec).
  const SESSION_REFETCH_SECONDS =
    Math.floor(0.9 * (WARNING_TIME_MS / 1000)) - 5;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content="" />

        <link
          rel="shortcut icon"
          href={"/assets/favicons/favicon.ico"}
          type="image/x-icon"
        />
        <link
          rel="apple-touch-icon"
          href={"/assets/favicons/apple-touch-icon-180x180.png"}
        />
        <link
          rel="mask-icon"
          href={"/assets/favicons/favicon.svg"}
          color="#005eb8"
        />
        <link
          rel="icon"
          sizes="192x192"
          href={"/assets/favicons/favicon-192x192.png"}
        />
        <meta
          name="msapplication-TileImage"
          content={"/assets/favicons/mediumtile-144x144.png"}
        />
        <meta name="msapplication-TileColor" content="#005eb8" />
        <meta
          name="msapplication-square70x70logo"
          content={"/assets/favicons/smalltile-70x70.png"}
        />
        <meta
          name="msapplication-square150x150logo"
          content={"/assets/favicons/mediumtile-150x150.png"}
        />
        <meta
          name="msapplication-wide310x150logo"
          content={"/assets/favicons/widetile-310x150.png"}
        />
        <meta
          name="msapplication-square310x310logo"
          content={"/assets/favicons/largetile-310x310.png"}
        />

        {/* NHS app js - https://nhsconnect.github.io/nhsapp-developer-documentation/js-v2-api-specification/ */}
        <Script
          src="https://www.nhsapp.service.nhs.uk/js/v2/nhsapp.js"
          strategy="beforeInteractive"
        />
      </head>

      <body>
        <SkipLink />
        <AppHeader />
        <SessionProvider refetchInterval={SESSION_REFETCH_SECONDS}>
          <InactivityDialog />
          <div className="nhsuk-width-container ">{children}</div>
        </SessionProvider>
        <AppFooter />
      </body>
    </html>
  );
}
