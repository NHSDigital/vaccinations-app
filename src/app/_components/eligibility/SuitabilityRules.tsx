import { MarkdownWithStyling } from "@src/app/_components/markdown/MarkdownWithStyling";
import { BasicCard } from "@src/app/_components/nhs-frontend/BasicCard";
import { RuleDisplayType, SuitabilityRule } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

interface SuitabilityRuleProps {
  suitabilityRules: SuitabilityRule[];
}

const SuitabilityRules = ({ suitabilityRules }: SuitabilityRuleProps): (JSX.Element | undefined)[] => {
  return suitabilityRules.map((suitabilityRule: SuitabilityRule) => {
    switch (suitabilityRule.type) {
      case RuleDisplayType.card: {
        return (
          <>
            <div key={suitabilityRule.content} data-testid="suitability-rule-card">
              <BasicCard content={suitabilityRule.content} />
            </div>
            {suitabilityRule.delineator && <hr />}
          </>
        );
      }
      case RuleDisplayType.infotext: {
        return (
          <>
            <div key={suitabilityRule.content} data-testid="suitability-rule-paragraph">
              <MarkdownWithStyling content={suitabilityRule.content} />
            </div>
            {suitabilityRule.delineator && <hr />}
          </>
        );
      }
    }
  });
};
export { SuitabilityRules };
