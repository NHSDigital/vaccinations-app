import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
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
      {props.howToGetVaccineFallback}
    </div>
  );
};

export { RSVEligibilityFallback };
