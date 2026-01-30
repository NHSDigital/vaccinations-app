"use client";

import React from "react";

import { TransitionLink } from "../navigation/TransitionLink";

// Ref: https://service-manual.nhs.uk/design-system/components/footer
const AppFooter = () => {
  return (
    <footer className="nhsuk-footer" role="contentinfo">
      <div className="nhsuk-width-container">
        <div className="nhsuk-footer__meta">
          <h2 className="nhsuk-u-visually-hidden">Support links</h2>
          <ul className="nhsuk-footer__list">
            <li className="nhsuk-footer__list-item">
              <TransitionLink
                className="nhsuk-footer__list-item-link"
                href="https://www.nhs.uk/nhs-app/nhs-app-help-and-support/vaccinations/check-and-book-an-rsv-vaccination"
                target={"_blank"}
              >
                Help and support
              </TransitionLink>
            </li>
            <li className="nhsuk-footer__list-item">
              <TransitionLink className="nhsuk-footer__list-item-link" href="/our-policies/cookies-policy">
                Cookies
              </TransitionLink>
            </li>
            <li className="nhsuk-footer__list-item">
              <TransitionLink
                className="nhsuk-footer__list-item-link"
                href="https://www.england.nhs.uk/contact-us/privacy-notice/national-flu-vaccination-programme/"
                target={"_blank"}
              >
                Privacy policy
              </TransitionLink>
            </li>
            <li className="nhsuk-footer__list-item">
              <TransitionLink className="nhsuk-footer__list-item-link" href="/our-policies/accessibility">
                Accessibility statement
              </TransitionLink>
            </li>
          </ul>
          <p className="nhsuk-body-s">© NHS England</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
