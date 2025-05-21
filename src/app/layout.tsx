"use client";

import InactivityDialog from "@src/app/_components/inactivity/InactivityDialog";
import SkipLink from "@src/app/_components/nhs-frontend/SkipLink";
import React, { JSX } from "react";
import "@public/nhsuk-frontend-9.1.0/css/nhsuk-9.1.0.min.css";
import "@public/nhsapp-frontend-2.3.0/nhsapp-2.3.0.min.css";

const NHSUK_FRONTEND_VERSION = "nhsuk-frontend-9.1.0";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
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
          href={`/${NHSUK_FRONTEND_VERSION}/assets/favicons/favicon.ico`}
          type="image/x-icon"
        />
        <link
          rel="apple-touch-icon"
          href={`/${NHSUK_FRONTEND_VERSION}/assets/favicons/apple-touch-icon-180x180.png`}
        />
        <link
          rel="mask-icon"
          href={`/${NHSUK_FRONTEND_VERSION}/assets/favicons/favicon.svg`}
          color="#005eb8"
        />
        <link
          rel="icon"
          sizes="192x192"
          href={`/${NHSUK_FRONTEND_VERSION}/assets/favicons/favicon-192x192.png`}
        />
        <meta
          name="msapplication-TileImage"
          content={`/${NHSUK_FRONTEND_VERSION}/assets/favicons/mediumtile-144x144.png`}
        />
        <meta name="msapplication-TileColor" content="#005eb8" />
        <meta
          name="msapplication-square70x70logo"
          content={`/${NHSUK_FRONTEND_VERSION}/assets/favicons/smalltile-70x70.png`}
        />
        <meta
          name="msapplication-square150x150logo"
          content={`/${NHSUK_FRONTEND_VERSION}/assets/favicons/mediumtile-150x150.png`}
        />
        <meta
          name="msapplication-wide310x150logo"
          content={`/${NHSUK_FRONTEND_VERSION}/assets/favicons/widetile-310x150.png`}
        />
        <meta
          name="msapplication-square310x310logo"
          content={`/${NHSUK_FRONTEND_VERSION}/assets/favicons/largetile-310x310.png`}
        />
      </head>

      <body>
        <SkipLink />
        <InactivityDialog />
        <div className="nhsuk-width-container ">{children}</div>
      </body>
    </html>
  );
}
