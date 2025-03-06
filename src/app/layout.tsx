import type { Metadata } from "next";
import { JSX } from "react";
import "@public/nhsapp-frontend-2.3.0/nhsapp-2.3.0.min.css";
import "@public/nhsuk-frontend-9.1.0/css/nhsuk-9.1.0.min.css";
export const metadata: Metadata = {
  title: "Default Layout Title",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <script
          src="/nhsuk-frontend-9.1.0/js/nhsuk-9.1.0.min.js"
          defer
        ></script>
      </head>
      <body>
        <a className="nhsuk-skip-link" href="#maincontent">
          Skip to main content
        </a>

        <div className="nhsuk-width-container ">
          <main className="nhsuk-main-wrapper " id="maincontent" role="main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
