import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { StyledPageSection } from "@src/services/content-api/types";
import { JSX } from "react";

const Recommendation = ({ recommendation }: { recommendation?: StyledPageSection }): JSX.Element => {
  return recommendation ? (
    <NonUrgentCareCard heading={recommendation.heading} content={recommendation.component} />
  ) : (
    <></>
  );
};

export default Recommendation;
