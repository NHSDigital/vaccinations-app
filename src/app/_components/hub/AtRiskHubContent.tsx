import { AtRiskText } from "@src/app/_components/hub/AtRiskText";
import React, { JSX } from "react";

const AtRiskHubContent = (): JSX.Element => {
  return (
    <details className="nhsuk-details">
      <summary className="nhsuk-details__summary">
        <h2 className="nhsuk-heading-xs nhsuk-u-margin-0 nhsuk-u-font-weight-normal">
          <span className="nhsuk-details__summary-text">Recommended vaccines for at-risk groups</span>
        </h2>
      </summary>
      <div className="nhsuk-details__text">
        <AtRiskText />
      </div>
    </details>
  );
};

export { AtRiskHubContent };
