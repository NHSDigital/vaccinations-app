import {
  Action,
  EligibilityContent,
  EligibilityStatus,
} from "@src/services/eligibility-api/types";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import React from "react";
import styles from "@src/app/_components/vaccine/styles.module.css";
import Markdown from "react-markdown";

interface EligibilityProps {
  eligibilityStatus: EligibilityStatus;
  eligibilityContent: EligibilityContent;
}

const Eligibility = ({ eligibilityContent }: EligibilityProps) => {
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
          <Markdown key={index}>{action.content}</Markdown>
        ))}
      </div>
    </div>
  );
};

export { Eligibility };
