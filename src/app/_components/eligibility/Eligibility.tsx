import { MarkdownWithStyling } from "@src/app/_components/markdown/MarkdownWithStyling";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import styles from "@src/app/_components/vaccine/styles.module.css";
import { Action, ActionType, EligibilityContent } from "@src/services/eligibility-api/types";
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
            <>
              <div className={styles.zeroMarginBottom}>
                <p className="nhsuk-u-margin-bottom-2">{eligibilityContent?.summary.introduction}</p>
                <ul>
                  {eligibilityContent?.summary.cohorts.map((cohort, index) => (
                    <li key={index}>{cohort}</li>
                  ))}
                </ul>
              </div>
            </>
          }
        />
      )}
      {eligibilityContent.actions.map((action: Action, index: number) => {
        switch (action.type) {
          case ActionType.paragraph: {
            return (
              <div key={index} data-testid="action-paragraph">
                <MarkdownWithStyling content={action.content} />
              </div>
            );
          }
          case ActionType.card: {
            const classNames = { h2: "nhsuk-card__heading", h3: "nhsuk-card__heading", p: "nhsuk-card__description" };
            const content = <MarkdownWithStyling content={action.content} classNames={classNames} />;
            return (
              <div key={index} className="nhsuk-card" data-testid="action-card">
                <div className="nhsuk-card__content">{content}</div>
              </div>
            );
          }
          default: {
            // Work in progress
          }
        }
      })}
    </div>
  );
};

export { Eligibility };
