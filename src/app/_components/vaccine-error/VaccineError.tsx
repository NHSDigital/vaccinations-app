"use client";

import { JSX } from "react";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { ErrorSummary } from "nhsuk-react-components";

interface VaccineProps {
  vaccineType: VaccineTypes;
}

const VaccineError = ({ vaccineType }: VaccineProps): JSX.Element => {
  const vaccineInfo = VaccineInfo[vaccineType];

  return (
    <div>
      <h1 className="app-dynamic-page-title__heading">{`${vaccineInfo.displayName.capitalised} vaccine`}</h1>
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
    </div>
  );
};

export default VaccineError;
