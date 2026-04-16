import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";
import React, { JSX } from "react";

const RSVEligibilityFallback = (props: {
  styledVaccineContent: StyledVaccineContent | undefined;
  vaccineType: VaccineType.RSV;
}): JSX.Element => {
  const howToGetVaccineOrFallback = props.styledVaccineContent ? (
    props.styledVaccineContent.howToGetVaccine.component
  ) : (
    <HowToGetVaccineFallback vaccineType={props.vaccineType} />
  );

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
      {howToGetVaccineOrFallback}
    </div>
  );
};

export { RSVEligibilityFallback };
