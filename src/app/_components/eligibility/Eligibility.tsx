import { EligibilityActions } from "@src/app/_components/eligibility/EligibilityActions";
import { SuitabilityRules } from "@src/app/_components/eligibility/SuitabilityRules";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { VaccineType } from "@src/models/vaccine";
import { EligibilityContent } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

interface EligibilityProps {
  eligibilityContent: EligibilityContent;
  vaccineType: VaccineType;
}

const Eligibility = ({ eligibilityContent, vaccineType }: EligibilityProps): JSX.Element => {
  return (
    <div data-testid="Eligibility">
      {eligibilityContent?.summary && (
        <NonUrgentCareCard
          heading={eligibilityContent.summary.heading}
          content={
            <>
              <p className="nhsuk-u-margin-bottom-2">{eligibilityContent?.summary.introduction}</p>
              <ul>
                {eligibilityContent?.summary.cohorts.map((cohort) => (
                  <li key={cohort}>{cohort}</li>
                ))}
              </ul>
            </>
          }
        />
      )}
      <SuitabilityRules suitabilityRules={eligibilityContent.suitabilityRules} />
      <EligibilityActions actions={eligibilityContent.actions} vaccineType={vaccineType} />
    </div>
  );
};

export { Eligibility };
