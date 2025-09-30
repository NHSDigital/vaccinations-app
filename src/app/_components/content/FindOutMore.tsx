import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import React, { JSX } from "react";

const FindOutMoreLink = (props: { findOutMoreUrl: URL; vaccineType: VaccineTypes }): JSX.Element => {
  const vaccineInfo = VaccineInfo[props.vaccineType];

  return (
    <p>
      <a
        href={props.findOutMoreUrl.href}
        target="_blank"
        rel="noopener"
      >{`Find out more about the ${vaccineInfo.displayName.midSentenceCase} vaccine`}</a>{" "}
      including side effects, allergies and ingredients.
    </p>
  );
};

export { FindOutMoreLink };
