import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { HEADINGS } from "@src/app/constants";
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
              <li>{"are aged between 75 and 79"}</li>
              <li>{"turned 80 after 1 September 2024"}</li>
            </ul>
          </>
        }
      />
      <h3>{HEADINGS.IF_THIS_APPLIES}</h3>
      {howToGetVaccineOrFallback}
      <div style={{ marginBottom: "24px" }}> </div>
      <PharmacyBookingInfo vaccineType={props.vaccineType} />
    </div>
  );
};

export { RSVEligibilityFallback };
