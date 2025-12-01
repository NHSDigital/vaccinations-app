import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { StyledVaccineContent } from "@src/services/content-api/types";
import { JSX } from "react";

const Recommendation = (props: { styledVaccineContent: StyledVaccineContent }): JSX.Element => {
  const element = props.styledVaccineContent.recommendation ? (
    <div data-testid="recommendation">
      <NonUrgentCareCard
        heading={props.styledVaccineContent.recommendation.heading}
        content={props.styledVaccineContent.recommendation.component}
      />
    </div>
  ) : (
    <></>
  );

  return element;
};
export default Recommendation;
