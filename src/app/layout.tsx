import "@public/css/app.css";
import { ClientUnhandledErrorLogger } from "@src/app/_components/client-unhandled-error-logger/ClientUnhandledErrorLogger";
import { ClientProviders } from "@src/app/_components/context/ClientProviders";
import { NoJsMessage } from "@src/app/_components/static/NoJsMessage";
import { StaticFooter } from "@src/app/_components/static/StaticFooter";
import { StaticHeader } from "@src/app/_components/static/StaticHeader";
import Script from "next/script";
import "nhsapp-frontend/dist/nhsapp/all.scss";
import "nhsuk-frontend/dist/nhsuk/nhsuk.scss";
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        <link rel="icon" href="/assets/images/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/assets/images/favicon.svg" sizes="any" type="image/svg+xml" />
        <link rel="mask-icon" href="/assets/images/nhsuk-icon-mask.svg" color="#005eb8" />
        <link rel="apple-touch-icon" href="/assets/images/nhsuk-icon-180.png" />
        <link rel="manifest" href="/assets/manifest.json" />

        {/* NHS app js - https://nhsconnect.github.io/nhsapp-developer-documentation/js-v2-api-specification/ */}
        <Script src={"https://www.nhsapp.service.nhs.uk/js/v2/nhsapp.js"} strategy="beforeInteractive" />
      </head>

      <body suppressHydrationWarning>
        <Script id="nhsuk-frontend-js-supported-script">
          {`document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' nhsuk-frontend-supported' : '');`}
        </Script>
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
