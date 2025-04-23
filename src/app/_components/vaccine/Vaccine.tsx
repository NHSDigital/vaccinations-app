"use client";

import { JSX, use } from "react";
import Details from "@src/app/_components/nhs-frontend/Details";
import { useVaccineContentContextValue } from "@src/app/_components/providers/VaccineContentProvider";
import { StyledVaccineContent } from "@src/services/content-api/parsers/content-styling-service";

interface VaccineProps {
  name: string;
}

const Vaccine = (props: VaccineProps): JSX.Element => {
  const { contentPromise } = useVaccineContentContextValue();
  const styledContent: StyledVaccineContent = use(contentPromise);

  return (
    <div>
      <h1 className="app-dynamic-page-title__heading">{`${props.name} vaccine`}</h1>
      <p data-testid="overview-text">{styledContent.overview}</p>

      <h2 className="nhsuk-heading-s">More information</h2>
      <div className="nhsuk-expander-group">
        {styledContent.whatVaccineIsFor ? (
          <Details
            title={styledContent.whatVaccineIsFor.heading}
            component={styledContent.whatVaccineIsFor.component}
          />
        ) : undefined}
        <Details
          title={styledContent.whoVaccineIsFor.heading}
          component={styledContent.whoVaccineIsFor.component}
        />
        <Details
          title={styledContent.howToGetVaccine.heading}
          component={styledContent.howToGetVaccine.component}
        />
      </div>
      <a href={styledContent.webpageLink}>
        Learn more about the {props.name} vaccination on nhs.uk
      </a>
    </div>
  );
};

export default Vaccine;
