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
        heading={<div>{"The RSV vaccine is recommended if you:"}</div>}
        content={
          <div className={styles.zeroMarginBottom}>
            <ul>
              <li>{"are aged 75 or over"}</li>
              <li>{"live in a care home for older adults"}</li>
            </ul>
          </div>
        }
      />
      <Expander title={HEADINGS.IF_THIS_APPLIES} component={props.howToGetVaccineFallback} notExpandable={true} />
      <PharmacyBookingInfo vaccineType={props.vaccineType} />
      <hr />
    </div>
  );
};

export { RSVEligibilityFallback };
