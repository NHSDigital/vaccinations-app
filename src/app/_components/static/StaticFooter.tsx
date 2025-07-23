import React from "react";

export function StaticFooter() {
  return (
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
  );
}
