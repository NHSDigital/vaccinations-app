import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { HEADINGS } from "@src/app/constants";
import { VaccineTypes } from "@src/models/vaccine";
import React, { JSX } from "react";

const RSVEligibilityFallback = (props: {
  howToGetVaccineFallback: JSX.Element;
  vaccineType: VaccineTypes.RSV;
}): JSX.Element => {
  return (
    <div data-testid="elid-fallback">
      <NonUrgentCareCard
        heading="The RSV vaccine is recommended if you:"
        content={
          <>
            <ul>
              <li>{"are aged between 75 and 79"}</li>
              <li>{"turned 80 after 1 September 2024"}</li>
            </ul>
          </>
        }
      />
      <h3>{HEADINGS.IF_THIS_APPLIES}</h3>
      {props.howToGetVaccineFallback}
      <PharmacyBookingInfo vaccineType={props.vaccineType} />
      <hr />
    </div>
  );
};

export { RSVEligibilityFallback };
