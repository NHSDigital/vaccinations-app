import React from "react";

export function StaticHeader() {
  return (
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
  );
}
