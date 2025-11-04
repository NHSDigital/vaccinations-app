import React from "react";

export function StaticFooter() {
  return (
    <footer className="nhsuk-footer" role="contentinfo">
      <div className="nhsuk-width-container">
        <div className="nhsuk-footer__meta">
          <h2 className="nhsuk-u-visually-hidden">Support links</h2>
          <ul className="nhsuk-footer__list">
            <li className="nhsuk-footer__list-item">
              <a
                className="nhsuk-footer__list-item-link"
                href="https://www.nhs.uk/nhs-app/nhs-app-help-and-support/vaccinations/check-and-book-an-rsv-vaccination"
                target="_blank"
              >
                Help and support
              </a>
            </li>
            <li className="nhsuk-footer__list-item">
              <a className="nhsuk-footer__list-item-link" href="/our-policies/cookies-policy">
                Cookies
              </a>
            </li>
            <li className="nhsuk-footer__list-item">
              <a
                className="nhsuk-footer__list-item-link"
                href="https://www.england.nhs.uk/contact-us/privacy-notice/national-flu-vaccination-programme/"
                target="_blank"
              >
                Privacy policy
              </a>
            </li>
            <li className="nhsuk-footer__list-item">
              <a className="nhsuk-footer__list-item-link" href="/our-policies/accessibility">
                Accessibility statement
              </a>
            </li>
          </ul>
          <p className="nhsuk-body-s">© NHS England</p>
        </div>
      </div>
    </footer>
  );
}
