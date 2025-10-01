"use client";

import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import React from "react";

const AccessibilityStatement = () => {
  return (
    <>
      <title>{`Accessibility statement - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <BackLink />
      <MainContent>
        <div className="app-dynamic-page-title nhsuk-u-margin-bottom-5  ">
          <h1 className="app-dynamic-page-title__heading">
            Accessibility statement for Check and book an RSV vaccination
          </h1>
        </div>

        <article>
          <section>
            <p>
              This accessibility statement applies to using the service on an iOS or Android device. It also applies
              when you access the same services by logging in through the NHS website in a web browser. When we publish
              new content, we will make sure that all features meet accessibility standards. We will update this
              statement with our progress on fixing any issues.
            </p>
            <h2>
              <b>Using accessibility settings on your device</b>
            </h2>
            <p>
              On a phone or tablet you can use the built-in{" "}
              <a href="https://www.apple.com/uk/accessibility/iphone/">Apple iOS</a> or{" "}
              <a href="https://support.google.com/accessibility/android/answer/6006564?hl=en-GB">Android</a>{" "}
              accessibility settings to make some parts of this service more accessible.
              <br />
              <br /> You can also log in from the NHS website. By changing the settings on your web browser or computer
              you should be able to:
            </p>
            <ul>
              <li>change colours, contrast levels and fonts</li>
              <li>zoom in up to 200% with the text staying visible on the screen</li>
              <li>navigate most of the website using just a keyboard</li>
              <li>navigate most of the website using speech recognition software</li>
              <li>
                listen to most of the website using a screen reader, including the latest versions of JAWS, NVDA and
                VoiceOver
              </li>
            </ul>
            <p>
              <a href="https://mcmw.abilitynet.org.uk/">AbilityNet</a> has advice to help you make your device easier to
              use if you have a disability.
            </p>
            <p>
              You need to create an NHS login to use this service. You can read the{" "}
              <a href="https://access.login.nhs.uk/accessibility">NHS login accessibility statement</a>.
            </p>
            <h2>How accessible is Check and book an RSV vaccination?</h2>
            <p>
              We regularly test our content to Web Content Accessibility Guidelines (WCAG) 2.2 on both mobile and
              desktop devices. We follow the NHS service manual guidance on{" "}
              <a href="https://service-manual.nhs.uk/accessibility">accessible design</a>. We also try to make text as
              simple as possible to understand, following the{" "}
              <a href="https://service-manual.nhs.uk/content">NHS style guide</a>.
            </p>
            <p>Our latest accessibility audit showed all pages in this service to be fully accessible.</p>

            <h2>How to report accessibility problems or give feedback</h2>
            <p>
              If you find any problems not listed on this page or you think we&apos;re not meeting accessibility
              requirements, email <a href="mailto:enquiries@nhsdigital.nhs.uk">enquiries@nhsdigital.nhs.uk</a>. We aim
              to respond to all enquiries within 72 hours.
            </p>
            <p>
              If you need documents from your health record in a different format, ask your health professional for
              assistance. This service can only show the information provided by your health professional.
            </p>

            <h3>Enforcement procedure</h3>
            <p>
              The Equality and Human Rights Commission (EHRC) is responsible for enforcing the{" "}
              <a href="https://www.legislation.gov.uk/uksi/2018/952/contents/made">
                Public Sector Bodies (Website and Mobile Applications) (No.2) Accessibility Regulations 2018 (the
                &apos;accessibility regulations&apos;)
              </a>
              . If you&apos;re not happy with how we respond to your complaint, contact the{" "}
              <a href="https://www.equalityadvisoryservice.com/">Equality Advisory and Support Service (EASS)</a>.
            </p>

            <h2>Technical information about the accessibility of Check and book an RSV vaccination</h2>
            <p>
              NHS England is committed to making this service accessible, in accordance with the{" "}
              <a href="https://www.legislation.gov.uk/uksi/2018/952/contents/made">
                Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018
              </a>
              .
            </p>
            <h3>Compliance status</h3>
            <p>
              This service is fully compliant with the{" "}
              <a href="https://www.legislation.gov.uk/uksi/2018/952/contents/made">
                Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018
              </a>
              .
            </p>
            <h2>Preparation of this accessibility statement</h2>
            <p>This statement was prepared on 26 September 2025. It was last reviewed on 26 September 2025.</p>
            <p>
              We continually test for accessibility needs. We&apos;re also committed to regular audits by independent
              specialist assessors.
            </p>
            <p>
              The NHS App was last audited by <a href="https://diginclusion.com">Dig Inclusion</a>
            </p>
            <p>iOS on 9 September 2025.</p>
            <p>Android on 9 September 2025.</p>
            <p>The browser version on 9 September 2025.</p>
          </section>
        </article>
      </MainContent>
    </>
  );
};

export default AccessibilityStatement;
