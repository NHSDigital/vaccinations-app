"use client";

import React, { use } from "react";
import Details from "@src/app/_components/nhs-frontend/Details";
import { useVaccineContentContextValue } from "@src/app/_components/providers/vaccine-content-provider";

interface VaccineProps {
  name: string;
}

const Vaccine = (props: VaccineProps): React.JSX.Element => {
  const { contentPromise } = useVaccineContentContextValue();
  const styledContent = use(contentPromise);

  return (
    <div>
      <h1 className="app-dynamic-page-title__heading">{`${props.name} vaccine`}</h1>
      <p>{styledContent.overview}</p>

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
        Find out more about {props.name} vaccination on the NHS.uk
      </a>
    </div>
  );
};

export default Vaccine;
