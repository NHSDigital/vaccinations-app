import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { HEADINGS } from "@src/app/constants";
import { VaccineType } from "@src/models/vaccine";
import React, { JSX } from "react";

const RSVEligibilityFallback = (props: {
  howToGetVaccineFallback: JSX.Element;
  vaccineType: VaccineType.RSV;
}): JSX.Element => {
  return (
    <div data-testid="elid-fallback">
      <NonUrgentCareCard
        heading="The RSV vaccine is recommended if you:"
        content={
          <>
            <ul>
              <li>{"are aged 75 or over"}</li>
              <li>{"live in a care home for older adults"}</li>
            </ul>
          </>
        }
      />
      <h3>{HEADINGS.IF_THIS_APPLIES}</h3>
      {props.howToGetVaccineFallback}
      <PharmacyBookingInfo vaccineType={props.vaccineType} />
    </div>
  );
};

export { RSVEligibilityFallback };
