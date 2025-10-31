import "@public/css/app.css";
import "@public/css/nhsapp-3.1.0.min.css";
import "@public/css/nhsuk-9.6.1.min.css";
import { ClientUnhandledErrorLogger } from "@src/app/_components/client-unhandled-error-logger/ClientUnhandledErrorLogger";
import { ClientProviders } from "@src/app/_components/context/ClientProviders";
import { NoJsMessage } from "@src/app/_components/static/NoJsMessage";
import { StaticFooter } from "@src/app/_components/static/StaticFooter";
import { StaticHeader } from "@src/app/_components/static/StaticHeader";
import Script from "next/script";
import React, { JSX } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  const appVersion = process.env.APP_VERSION;

  return (
    <html lang="en">
      <head>
        <meta name="app-version" content={appVersion} />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href={"/assets/favicons/favicon.ico"} type="image/x-icon" />
        <link rel="apple-touch-icon" href={"/assets/favicons/apple-touch-icon-180x180.png"} />
        <link rel="mask-icon" href={"/assets/favicons/favicon.svg"} color="#005eb8" />
        <link rel="icon" sizes="192x192" href={"/assets/favicons/favicon-192x192.png"} />
        <meta name="msapplication-TileImage" content={"/assets/favicons/mediumtile-144x144.png"} />
        <meta name="msapplication-TileColor" content="#005eb8" />
        <meta name="msapplication-square70x70logo" content={"/assets/favicons/smalltile-70x70.png"} />
        <meta name="msapplication-square150x150logo" content={"/assets/favicons/mediumtile-150x150.png"} />
        <meta name="msapplication-wide310x150logo" content={"/assets/favicons/widetile-310x150.png"} />
        <meta name="msapplication-square310x310logo" content={"/assets/favicons/largetile-310x310.png"} />

        {/* NHS app js - https://nhsconnect.github.io/nhsapp-developer-documentation/js-v2-api-specification/ */}
        <Script src={"https://www.nhsapp.service.nhs.uk/js/v2/nhsapp.js"} strategy="beforeInteractive" />
      </head>

      <body>
        <noscript>
          <style>{`#app-root { display: none !important; }`}</style>
          <style>{`#loaderContainer { display: none !important; }`}</style>
          <StaticHeader />
          <NoJsMessage />
          <StaticFooter />
        </noscript>
        <ClientUnhandledErrorLogger />
        <div id="app-root" className="appLayout">
          <ClientProviders>{children}</ClientProviders>
        </div>
      </body>
    </html>
  );
}
