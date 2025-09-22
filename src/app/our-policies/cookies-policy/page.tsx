"use client";

import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import React from "react";

const CookiesPolicy = () => {
  return (
    <>
      <title>{`Cookies policy - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <BackLink />
      <MainContent>
        <h1>Cookies</h1>
        <h2>Summary</h2>
        <p>
          NHS England (“we” or “us”) uses cookies to deliver this service. The information set out in this policy is
          provided in addition to our{" "}
          <a href={"https://www.england.nhs.uk/contact-us/privacy-notice/national-flu-vaccination-programme/"}>
            privacy policy
          </a>
        </p>
        <p>and should be read alongside it.</p>
        <p>
          We put small files called cookies onto your device, like your mobile phone or computer. Cookies are widely
          used to make websites and apps work, or work more efficiently, as well as to provide services and
          functionalities for users.
        </p>
        <p>Cookies fall into 2 categories, strictly necessary cookies and optional cookies.</p>
        <p>We only put:</p>
        <ul aria-label={"what-cookies"}>
          <li>strictly necessary cookies on your device to make this service work</li>
        </ul>
      </MainContent>
    </>
  );
};

export default CookiesPolicy;
