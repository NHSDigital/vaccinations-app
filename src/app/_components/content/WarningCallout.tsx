import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";
import { JSX } from "react";

const WarningCallout = (props: {
  styledVaccineContent: StyledVaccineContent;
  vaccineType: VaccineType;
}): JSX.Element => {
  const element =
    props.styledVaccineContent.callout && !VaccineInfo[props.vaccineType].supressWarningCallout ? (
      <div data-testid="callout" className="nhsuk-warning-callout">
        <h3 className="nhsuk-warning-callout__label">
          <span role="text">
            <span className="nhsuk-u-visually-hidden">Important: </span>
            {props.styledVaccineContent.callout.heading}
          </span>
        </h3>
        <div data-testid="callout-text">{props.styledVaccineContent.callout.component}</div>
      </div>
    ) : (
      <></>
    );
  return element;
};
export default WarningCallout;
