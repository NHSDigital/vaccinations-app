import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import React, { JSX } from "react";

const FindOutMoreLink = (props: { findOutMoreUrl: URL; vaccineType: VaccineType }): JSX.Element => {
  const vaccineInfo = VaccineInfo[props.vaccineType];

  return (
    <p>
      <a
        href={props.findOutMoreUrl.href}
        target="_blank"
        rel="noopener"
      >{`Find out more about the ${vaccineInfo.displayName.midSentenceCase} vaccine`}</a>
      , including allergies and ingredients.
    </p>
  );
};

export { FindOutMoreLink };
