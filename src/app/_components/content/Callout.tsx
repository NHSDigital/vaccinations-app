import WarningCallout from "@src/app/_components/nhs-frontend/WarningCallout";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";
import { JSX } from "react";

const Callout = (props: { styledVaccineContent: StyledVaccineContent; vaccineType: VaccineType }): JSX.Element => {
  const element =
    props.styledVaccineContent.callout && !VaccineInfo[props.vaccineType].supressWarningCallout ? (
      <WarningCallout
        heading={props.styledVaccineContent.callout.heading}
        content={props.styledVaccineContent.callout.content}
      />
    ) : (
      <></>
    );
  return element;
};
export { Callout };
