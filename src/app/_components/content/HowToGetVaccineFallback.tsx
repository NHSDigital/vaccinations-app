import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import React, { JSX } from "react";

const HowToGetVaccineFallback = (props: { vaccineType: VaccineTypes }): JSX.Element => {
  const vaccineInfo = VaccineInfo[props.vaccineType];

  return (
    <p>
      Find out{" "}
      <a href={vaccineInfo.nhsHowToGetWebpageLink.href} target="_blank" rel="noopener">
        how to get
      </a>{" "}
      {`an ${vaccineInfo.displayName.midSentenceCase} vaccination`}
    </p>
  );
};

export { HowToGetVaccineFallback };
