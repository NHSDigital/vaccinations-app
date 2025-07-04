import { VaccineDetails } from "@src/models/vaccine";
import React, { JSX } from "react";

const FindOutMoreLink = (props: { findOutMoreUrl: URL; vaccineInfo: VaccineDetails }): JSX.Element => {
  return (
    <p>
      <a href={props.findOutMoreUrl.href} target="_blank" rel="noopener">
        Find out more about the {props.vaccineInfo.displayName.midSentenceCase} vaccine
      </a>{" "}
      including side effects, allergies and ingredients.
    </p>
  );
};

export { FindOutMoreLink };
