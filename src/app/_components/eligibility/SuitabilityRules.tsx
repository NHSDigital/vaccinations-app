import { MarkdownWithStyling } from "@src/app/_components/markdown/MarkdownWithStyling";
import { BasicCard } from "@src/app/_components/nhs-frontend/BasicCard";
import { RuleDisplayType, SuitabilityRule } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

interface SuitabilityRuleProps {
  suitabilityRules: SuitabilityRule[];
}

const SuitabilityRules = ({ suitabilityRules }: SuitabilityRuleProps): (JSX.Element | undefined)[] => {
  return suitabilityRules.map((suitabilityRule: SuitabilityRule, index: number) => {
    switch (suitabilityRule.type) {
      case RuleDisplayType.card: {
        return (
          <div key={index}>
            <BasicCard content={suitabilityRule.content} />
          </div>
        );
      }
      case RuleDisplayType.infotext: {
        return (
          <div key={index} data-testid="action-paragraph">
            <MarkdownWithStyling content={suitabilityRule.content} />
          </div>
        );
      }
    }
  });
};
export { SuitabilityRules };
