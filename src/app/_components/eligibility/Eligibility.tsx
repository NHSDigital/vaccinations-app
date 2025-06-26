import {
  Action,
  EligibilityContent,
  EligibilityStatus,
} from "@src/services/eligibility-api/types";
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
      <NonUrgentCareCard
        heading={<div>{eligibilityContent?.status.heading}</div>}
        content={
          <div className={styles.zeroMarginBottom}>
            <p className="nhsuk-u-margin-bottom-2">
              {eligibilityContent?.status.introduction}
            </p>
            <ul>
              {eligibilityContent?.status.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        }
      />
      <div>
        {eligibilityContent.actions.map((action: Action, index: number) => (
          <MarkdownWithStyling key={index} content={action.content} />
        ))}
      </div>
    </div>
  );
};

export { Eligibility };
