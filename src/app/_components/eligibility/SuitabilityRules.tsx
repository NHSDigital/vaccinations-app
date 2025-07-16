import { MarkdownWithStyling } from "@src/app/_components/markdown/MarkdownWithStyling";
import { RuleType, SuitabilityRule } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

interface SuitabilityRuleProps {
  suitabilityRules: SuitabilityRule[];
}

const SuitabilityRules = ({ suitabilityRules }: SuitabilityRuleProps): (JSX.Element | undefined)[] => {
  return suitabilityRules.map((suitabilityRule: SuitabilityRule, index: number) => {
    switch (suitabilityRule.type) {
      case RuleType.card: {
        const classNames = {
          h2: "nhsuk-heading-m nhsuk-card__heading",
          h3: "nhsuk-heading-s nhsuk-card__heading",
          p: "nhsuk-card__description",
        };
        const content = <MarkdownWithStyling content={suitabilityRule.content} classNames={classNames} />;
        return (
          <div key={index} className="nhsuk-card" data-testid="suitabilityRule-card">
            <div className="nhsuk-card__content">{content}</div>
          </div>
        );
      }
      case RuleType.unknown: {
        const classNames = {
          h2: "nhsuk-heading-m nhsuk-card__heading",
          h3: "nhsuk-heading-s nhsuk-card__heading",
          p: "nhsuk-card__description",
        };
        const content = <MarkdownWithStyling content={suitabilityRule.content} classNames={classNames} />;
        return (
          <div key={index} className="nhsuk-card" data-testid="suitabilityRule-card">
            <div className="nhsuk-card__content">{content}</div>
          </div>
        );
      }
    }
  });
};
export { SuitabilityRules };
