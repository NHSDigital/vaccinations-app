import React from "react";

export function NoJsMessage() {
  return (
    <div className="nhsuk-width-container">
      <main className="nhsuk-main-wrapper nhsuk-main-wrapper--s" id="maincontent">
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-full">
            <h1 className={"nhsuk-heading-xl nhsuk-u-margin-bottom-5"}>Cannot show page</h1>
            <p>You need to turn on JavaScript to access NHS App services in your browser.</p>
            <p>
              <a
                href="https://www.nhs.uk/nhs-app/nhs-app-help-and-support/nhs-app-technical-information/technical-issues-with-the-nhs-app/"
                target="_blank"
                rel="noopener"
              >
                How to turn on JavaScript
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
