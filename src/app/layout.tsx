import "@public/css/nhsapp-3.1.0.min.css";
import "@public/css/nhsuk-9.6.1.min.css";
import { ClientProviders } from "@src/app/_components/context/ClientProviders";
import "@src/app/global.css";
import Script from "next/script";
import React, { JSX } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" className="js-hidden" suppressHydrationWarning>
      <head>
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

        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('js-hidden');`,
          }}
        />

        {/* NHS app js - https://nhsconnect.github.io/nhsapp-developer-documentation/js-v2-api-specification/ */}
        <Script src={"https://www.nhsapp.service.nhs.uk/js/v2/nhsapp.js"} strategy="beforeInteractive" />
      </head>

      <body>
        <noscript>
          <header className="nhsuk-header nhsuk-header__transactional" role="banner">
            <div className="nhsuk-width-container nhsuk-header__container">
              <div className="nhsuk-header__logo nhsuk-header__transactional--logo">
                <a className="nhsuk-header__link" aria-label="NHS homepage" href="/check-and-book-rsv">
                  <svg
                    className="nhsuk-logo"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 16"
                    height="40"
                    width="100"
                    aria-labelledby="nhsuk-logo_title"
                  >
                    <title id="nhsuk-logo_title">NHS Logo</title>
                    <path className="nhsuk-logo__background" d="M0 0h40v16H0z" fill="#005eb8"></path>
                    <path
                      className="nhsuk-logo__text"
                      fill="#fff"
                      d="M3.9 1.5h4.4l2.6 9h.1l1.8-9h3.3l-2.8 13H9l-2.7-9h-.1l-1.8 9H1.1M17.3 1.5h3.6l-1 4.9h4L25 1.5h3.5l-2.7 13h-3.5l1.1-5.6h-4.1l-1.2 5.6h-3.4M37.7 4.4c-.7-.3-1.6-.6-2.9-.6-1.4 0-2.5.2-2.5 1.3 0 1.8 5.1 1.2 5.1 5.1 0 3.6-3.3 4.5-6.4 4.5-1.3 0-2.9-.3-4-.7l.8-2.7c.7.4 2.1.7 3.2.7s2.8-.2 2.8-1.5c0-2.1-5.1-1.3-5.1-5 0-3.4 2.9-4.4 5.8-4.4 1.6 0 3.1.2 4 .6"
                    ></path>
                  </svg>
                </a>
              </div>
              <div className="nhsuk-header__transactional-service-name">
                <a className="nhsuk-header__transactional-service-name--link" href="/check-and-book-rsv">
                  Check and book an RSV vaccination
                </a>
              </div>
            </div>
          </header>
          <div className="nhsuk-width-container">
            <main className="nhsuk-main-wrapper nhsuk-main-wrapper--s" id="maincontent">
              <div className="nhsuk-grid-row">
                <div className="nhsuk-grid-column-full">
                  <h1 className="app-dynamic-page-title__heading">Cannot show page</h1>
                  <p>You need to turn on JavaScript to access NHS App services in your browser.</p>
                </div>
              </div>
            </main>
          </div>
          <footer role="contentinfo">
            <div className="nhsuk-footer-container">
              <div className="nhsuk-width-container">
                <h2 className="nhsuk-u-visually-hidden">Support links</h2>
                <div className="nhsuk-footer">
                  <ul className="nhsuk-footer__list">
                    <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                      <a className="nhsuk-footer__list-item-link" href="/our-policies/terms">
                        Terms of use
                      </a>
                    </li>
                    <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                      <a
                        className="nhsuk-footer__list-item-link"
                        href="https://www.england.nhs.uk/contact-us/privacy-notice/national-flu-vaccination-programme/"
                        target="_blank"
                      >
                        Privacy policy
                      </a>
                    </li>
                    <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                      <a
                        className="nhsuk-footer__list-item-link"
                        href="https://www.nhs.uk/nhs-app/nhs-app-help-and-support/"
                        target="_blank"
                      >
                        Help and support
                      </a>
                    </li>
                    <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                      <a className="nhsuk-footer__list-item-link" href="/our-policies/accessibility">
                        Accessibility statement
                      </a>
                    </li>
                    <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                      <a className="nhsuk-footer__list-item-link" href="/our-policies/cookies-policy">
                        Cookies
                      </a>
                    </li>
                  </ul>
                  <p className="nhsuk-footer__copyright">© Crown copyright</p>
                </div>
              </div>
            </div>
          </footer>
        </noscript>

        <div className="app-wrapper">
          <ClientProviders>{children}</ClientProviders>
        </div>
      </body>
    </html>
  );
}
