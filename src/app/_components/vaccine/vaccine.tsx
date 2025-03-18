"use client";

import React, { use } from "react";
import { VaccineTypes } from "@src/models/vaccine";
import Details from "@src/app/_components/nhs-frontend/Details";
import { useVaccineContent } from "@src/app/_components/providers/VaccineContentProvider";

interface VaccineProps {
  name: string;
  vaccine: VaccineTypes;
}

const Vaccine = (props: VaccineProps): React.JSX.Element => {
  const { contentPromise } = useVaccineContent();
  const content = use(contentPromise);

  return (
    <div>
      <h1 className="app-dynamic-page-title__heading">{props.name} Vaccine</h1>
      <p>{content.overview}</p>

      <h2 className="nhsuk-heading-s">More information</h2>
      <div className="nhsuk-expander-group">
        <Details
          summaryText={content.whatVaccineIsFor.heading}
          text={content.whatVaccineIsFor.text}
        />
        <Details
          summaryText={content.whoVaccineIsFor.heading}
          text={content.whoVaccineIsFor.text}
        />
        <Details
          summaryText={content.howToGetVaccine.heading}
          text={content.howToGetVaccine.text}
        />
      </div>
      <a href={content.webpageLink}>
        Find out more about {props.name} vaccination on the NHS.uk
      </a>
    </div>
  );
};

export default Vaccine;
