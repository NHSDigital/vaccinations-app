import { VaccineType } from "@src/models/vaccine";
import { Overview as StyledOverview } from "@src/services/content-api/types";
import { linksOpenCorrectly } from "@src/utils/html";
import { JSX } from "react";

const Overview = (props: { overview: StyledOverview | undefined; vaccineType: VaccineType }): JSX.Element => {
  const element = props.overview ? (
    props.overview.containsHtml ? (
      <div dangerouslySetInnerHTML={{ __html: linksOpenCorrectly(props.overview.content) || "" }} />
    ) : (
      <p>{props.overview.content}</p>
    )
  ) : (
    <></>
  );
  return element;
};
export { Overview };
