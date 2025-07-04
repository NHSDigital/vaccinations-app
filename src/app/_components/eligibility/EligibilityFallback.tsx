import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import styles from "@src/app/_components/vaccine/styles.module.css";
import Details from "@src/app/_components/nhs-frontend/Details";
import React, { JSX } from "react";
import { HEADINGS } from "@src/app/constants";

const EligibilityFallback = (props: { howToGetVaccineFallback: JSX.Element; nbsLink: string }): JSX.Element => {
  return (
    <div data-testid="elid-fallback">
      <NonUrgentCareCard
        heading={<div>{"You should have RSV vaccine if you:"}</div>}
        content={
          <div className={styles.zeroMarginBottom}>
            <ul>
              <li>{"are aged between 75 and 79"}</li>
              <li>{"turned 80 after 1 September 2024"}</li>
            </ul>
          </div>
        }
      />
      <Details title={HEADINGS.IF_YOU_THINK} component={props.howToGetVaccineFallback} notExpandable={true} />
      <p>
        {"In some areas you can "}
        <a href={props.nbsLink}>book an RSV vaccination in a pharmacy</a>
      </p>
    </div>
  );
};

export { EligibilityFallback };
