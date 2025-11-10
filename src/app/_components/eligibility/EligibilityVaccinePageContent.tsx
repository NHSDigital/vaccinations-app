import { Eligibility as EligibilityComponent } from "@src/app/_components/eligibility/Eligibility";
import { RSVEligibilityFallback } from "@src/app/_components/eligibility/RSVEligibilityFallback";
import { VaccineTypes } from "@src/models/vaccine";
import { EligibilityForPersonType } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

const EligibilityVaccinePageContent = (props: {
  vaccineType: VaccineTypes;
  eligibilityForPerson: EligibilityForPersonType;
  howToGetVaccineOrFallback: JSX.Element;
}): JSX.Element => {
  return (
    <>
      {props.vaccineType === VaccineTypes.RSV &&
        !props.eligibilityForPerson.eligibilityError &&
        props.eligibilityForPerson.eligibility?.content &&
        props.eligibilityForPerson.eligibility?.status && (
          <EligibilityComponent eligibilityContent={props.eligibilityForPerson.eligibility.content} />
        )}
      {/* Fallback eligibility section for RSV */}
      {props.vaccineType === VaccineTypes.RSV && props.eligibilityForPerson.eligibilityError && (
        <RSVEligibilityFallback
          howToGetVaccineFallback={props.howToGetVaccineOrFallback}
          vaccineType={props.vaccineType}
        />
      )}
    </>
  );
};

export { EligibilityVaccinePageContent };
