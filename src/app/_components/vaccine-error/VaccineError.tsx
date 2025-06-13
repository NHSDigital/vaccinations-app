"use client";

import { JSX } from "react";
import { ErrorSummary } from "nhsuk-react-components";

const VaccineError = (): JSX.Element => {
  return (
    <ErrorSummary>
      <ErrorSummary.Title>Vaccine content is unavailable</ErrorSummary.Title>
      <ErrorSummary.Body>
        <p>
          Sorry, there is a problem showing vaccine information. Come back
          later, or read about{" "}
          <a
            href="https://www.nhs.uk/vaccinations/"
            target="_blank"
            rel="noopener"
          >
            vaccinations on NHS.uk
          </a>
        </p>
      </ErrorSummary.Body>
    </ErrorSummary>
  );
};

export default VaccineError;
