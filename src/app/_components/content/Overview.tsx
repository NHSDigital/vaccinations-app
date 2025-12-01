import { VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";
import { JSX } from "react";

const Overview = (props: { styledVaccineContent: StyledVaccineContent; vaccineType: VaccineType }): JSX.Element => {
  const element = props.styledVaccineContent.overview ? (
    props.styledVaccineContent.overview.containsHtml ? (
      <div
        data-testid="overview-text"
        dangerouslySetInnerHTML={{ __html: props.styledVaccineContent.overview.content || "" }}
      />
    ) : (
      <p data-testid="overview-text">{props.styledVaccineContent.overview.content}</p>
    )
  ) : (
    <></>
  );
  return element;
};
export { Overview };
