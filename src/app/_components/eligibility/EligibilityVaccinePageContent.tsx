import { Eligibility as EligibilityComponent } from "@src/app/_components/eligibility/Eligibility";
import { RSVEligibilityFallback } from "@src/app/_components/eligibility/RSVEligibilityFallback";
import { VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";
import { EligibilityForPersonType } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

const EligibilityVaccinePageContent = (props: {
  vaccineType: VaccineType;
  eligibilityForPerson: EligibilityForPersonType;
  styledVaccineContent: StyledVaccineContent | undefined;
  showDynamicEligibilityContent: boolean;
}): JSX.Element => {
  return (
    <>
      {props.showDynamicEligibilityContent && props.eligibilityForPerson.eligibility?.content && (
        <EligibilityComponent
          eligibilityContent={props.eligibilityForPerson.eligibility.content}
          vaccineType={props.vaccineType}
        />
      )}
      {/* Fallback eligibility section for RSV */}
      {props.vaccineType === VaccineType.RSV && props.eligibilityForPerson.eligibilityError && (
        <RSVEligibilityFallback styledVaccineContent={props.styledVaccineContent} vaccineType={props.vaccineType} />
      )}
    </>
  );
};

export { EligibilityVaccinePageContent };
