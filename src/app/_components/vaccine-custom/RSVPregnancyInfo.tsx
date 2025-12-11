import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { HEADINGS } from "@src/app/constants";
import { VaccineType } from "@src/models/vaccine";
import React, { JSX } from "react";

const RSVPregnancyInfo = (props: { vaccineType: VaccineType; howToGetVaccineOrFallback: JSX.Element }): JSX.Element => {
  return (
    <>
      <NonUrgentCareCard
        heading={"The RSV vaccine is recommended if you:"}
        content={
          <>
            <ul>
              <li>are over 28 weeks pregnant</li>
              <li>have not had the vaccine during this pregnancy</li>
            </ul>
          </>
        }
      />

      {/* How-to-get-vaccine section for RSV in pregnancy */}
      <h3>{HEADINGS.HOW_TO_GET_VACCINE}</h3>
      {props.howToGetVaccineOrFallback}
      <PharmacyBookingInfo vaccineType={props.vaccineType} />
    </>
  );
};

export { RSVPregnancyInfo };
