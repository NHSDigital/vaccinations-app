import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import Expander from "@src/app/_components/nhs-frontend/Expander";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import styles from "@src/app/_components/vaccine/styles.module.css";
import { HEADINGS } from "@src/app/constants";
import { VaccineTypes } from "@src/models/vaccine";
import React, { JSX } from "react";

const RSVEligibilityFallback = (props: {
  howToGetVaccineFallback: JSX.Element;
  vaccineType: VaccineTypes;
}): JSX.Element => {
  return (
    <div data-testid="elid-fallback">
      <NonUrgentCareCard
        heading={<div>{"You should have the RSV vaccine if you:"}</div>}
        content={
          <div className={styles.zeroMarginBottom}>
            <ul>
              <li>{"are aged between 75 and 79"}</li>
              <li>{"turned 80 after 1 September 2024"}</li>
            </ul>
          </div>
        }
      />
      <Expander title={HEADINGS.IF_YOU_THINK} component={props.howToGetVaccineFallback} notExpandable={true} />
      <PharmacyBookingInfo vaccineType={props.vaccineType} />
      <hr />
    </div>
  );
};

export { RSVEligibilityFallback };
