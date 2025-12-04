import { VaccineType } from "@src/models/vaccine";
import { Overview as StyledOverview } from "@src/services/content-api/types";
import { fixupHtmlFragment } from "@src/utils/html";
import { JSX } from "react";

const Overview = (props: { overview: StyledOverview | undefined; vaccineType: VaccineType }): JSX.Element => {
  const element = props.overview ? (
    props.overview.containsHtml ? (
      <div
        data-testid="overview-text"
        dangerouslySetInnerHTML={{ __html: fixupHtmlFragment(props.overview.content) || "" }}
      />
    ) : (
      <p data-testid="overview-text">{props.overview.content}</p>
    )
  ) : (
    <></>
  );
  return element;
};
export { Overview };
