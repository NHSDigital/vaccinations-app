"use client";

import { VaccineTypes } from "@src/models/vaccine";
import { ContentApiVaccineResponse } from "@src/services/content-api/parsers/content-filter-service";
import React, { use } from "react";
import Details from "@src/app/_components/nhs-frontend/Details";
import { useVaccineContentContextValue } from "@src/app/_components/providers/VaccineContentProvider";
import {
  getStyledContentForVaccine,
  StyledVaccineContent
} from "@src/services/content-api/parsers/content-styling-service";

interface VaccineProps {
  name: string;
  vaccine: VaccineTypes
}

const Vaccine = (props: VaccineProps): React.JSX.Element => {
  const { contentPromise } = useVaccineContentContextValue();
  const rawContent: ContentApiVaccineResponse = use(contentPromise);
  const styledContent: StyledVaccineContent = use(getStyledContentForVaccine(props.vaccine, rawContent));

  return (
    <div>
      <h1 className="app-dynamic-page-title__heading">{`${props.name} vaccine`}</h1>
      <p data-testid="overview-text">{styledContent.overview}</p>

      <h2 className="nhsuk-heading-s">More information</h2>
      <div className="nhsuk-expander-group">
        <Details
          title={styledContent.whatVaccineIsFor.heading}
          component={styledContent.whatVaccineIsFor.component}
        />
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
