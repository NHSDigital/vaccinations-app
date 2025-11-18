import { VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";
import { JSX } from "react";

const Overview = (props: { styledVaccineContent: StyledVaccineContent; vaccineType: VaccineType }): JSX.Element => {
  return (
    <>
      <p data-testid="overview-text">{props.styledVaccineContent?.overview}</p>
    </>
  );
};
export { Overview };
