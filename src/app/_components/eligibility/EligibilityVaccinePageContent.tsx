import { Eligibility as EligibilityComponent } from "@src/app/_components/eligibility/Eligibility";
import { RSVEligibilityFallback } from "@src/app/_components/eligibility/RSVEligibilityFallback";
import { VaccineTypes } from "@src/models/vaccine";
import { Eligibility, EligibilityErrorTypes } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

const EligibilityVaccinePageContent = (props: {
  vaccineType: VaccineTypes;
  eligibility: Eligibility | undefined;
  eligibilityError: EligibilityErrorTypes | undefined;
  howToGetVaccineOrFallback: JSX.Element;
}): JSX.Element => {
  return (
    <>
      {props.vaccineType === VaccineTypes.RSV &&
        !props.eligibilityError &&
        props.eligibility?.content &&
        props.eligibility?.status && <EligibilityComponent eligibilityContent={props.eligibility.content} />}
      {/* Fallback eligibility section for RSV */}
      {props.vaccineType === VaccineTypes.RSV && props.eligibilityError && (
        <RSVEligibilityFallback
          howToGetVaccineFallback={props.howToGetVaccineOrFallback}
          vaccineType={props.vaccineType}
        />
      )}
    </>
  );
};

export { EligibilityVaccinePageContent };
