import { IdAndHeading } from "@src/app/our-policies/cookies-policy/page";
import React, { JSX } from "react";

const SummaryPage = (props: IdAndHeading): JSX.Element => {
  return (
    <>
      <h2 id={props.id}>{props.heading}</h2>
      <p>
        NHS England (“we” or “us”) uses cookies to deliver this service. The information set out in this policy is
        provided in addition to our{" "}
        <a
          href="https://www.england.nhs.uk/contact-us/privacy-notice/national-flu-vaccination-programme/"
          target="_blank"
        >
          privacy policy
        </a>{" "}
        and should be read alongside it.
      </p>
      <p>
        We put small files called cookies onto your device, like your mobile phone or computer. Cookies are widely used
        to make websites and apps work, or work more efficiently, as well as to provide services and functionalities for
        users.
      </p>
      <p>Cookies fall into 2 categories, strictly necessary cookies and optional cookies.</p>
      <p>We only put:</p>
      <ul aria-label={"list of cookies"}>
        <li>strictly necessary cookies on your device to make this service work</li>
      </ul>
    </>
  );
};

export { SummaryPage };
