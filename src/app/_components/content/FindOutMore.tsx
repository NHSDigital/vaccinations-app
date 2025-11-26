import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { Url } from "@src/utils/Url";
import React, { JSX } from "react";

const FindOutMoreLink = (props: { findOutMoreUrl: Url; vaccineType: VaccineType }): JSX.Element => {
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
