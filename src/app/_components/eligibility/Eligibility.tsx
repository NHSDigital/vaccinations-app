import { Action, EligibilityContent, EligibilityStatus } from "@src/services/eligibility-api/types";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import React, { JSX } from "react";
import styles from "@src/app/_components/vaccine/styles.module.css";
import { MarkdownWithStyling } from "@src/app/_components/markdown/MarkdownWithStyling";

interface EligibilityProps {
  eligibilityStatus: EligibilityStatus;
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
                {eligibilityContent?.summary.cohorts.map((cohort, index) => (
                  <li key={index}>{cohort}</li>
                ))}
              </ul>
            </div>
          }
        />
      )}
      {eligibilityContent.actions.map((action: Action, index: number) => {
        if (action.type === "paragraph") {
          return (
            <div key={index} data-testid="action-paragraph">
              <MarkdownWithStyling content={action.content} />
            </div>
          );
        }
      })}
    </div>
  );
};

export { Eligibility };
