import { EligibilityActions } from "@src/app/_components/eligibility/EligibilityActions";
import { SuitabilityRules } from "@src/app/_components/eligibility/SuitabilityRules";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import styles from "@src/app/_components/vaccine/styles.module.css";
import { EligibilityContent } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

interface EligibilityProps {
  eligibilityContent: EligibilityContent;
}

const Eligibility = ({ eligibilityContent }: EligibilityProps): JSX.Element => {
  return (
    <div data-testid="Eligibility">
      {eligibilityContent?.summary && (
        <NonUrgentCareCard
          heading={<div>{eligibilityContent?.summary.heading}</div>}
          content={
            <div className={styles.zeroMarginBottom}>
              <p className="nhsuk-u-margin-bottom-2">{eligibilityContent?.summary.introduction}</p>
              <ul>
                {eligibilityContent?.summary.cohorts.map((cohort) => (
                  <li key={cohort}>{cohort}</li>
                ))}
              </ul>
            </div>
          }
        />
      )}
      <SuitabilityRules suitabilityRules={eligibilityContent.suitabilityRules} />
      <EligibilityActions actions={eligibilityContent.actions} />
    </div>
  );
};

export { Eligibility };
