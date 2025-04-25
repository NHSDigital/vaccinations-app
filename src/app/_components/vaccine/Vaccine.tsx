"use client";

import { JSX, use } from "react";
import Details from "@src/app/_components/nhs-frontend/Details";
import { useVaccineContentContextValue } from "@src/app/_components/providers/VaccineContentProvider";
import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";

interface VaccineProps {
  vaccineType: VaccineTypes;
}

const Vaccine = ({ vaccineType }: VaccineProps): JSX.Element => {
  const { contentPromise } = useVaccineContentContextValue();
  const { styledVaccineContent, contentError }: GetContentForVaccineResponse =
    use(contentPromise);

  return (
    <>
      {contentError || styledVaccineContent === undefined ? (
        <VaccineError vaccineType={vaccineType} />
      ) : (
        <div>
          <h1 className="app-dynamic-page-title__heading">{`${VaccineDisplayNames[vaccineType]} vaccine`}</h1>
          <p data-testid="overview-text">{styledVaccineContent.overview}</p>

          <h2 className="nhsuk-heading-s">More information</h2>
          <div className="nhsuk-expander-group">
            {styledVaccineContent.whatVaccineIsFor ? (
              <Details
                title={styledVaccineContent.whatVaccineIsFor.heading}
                component={styledVaccineContent.whatVaccineIsFor.component}
              />
            ) : undefined}
            <Details
              title={styledVaccineContent.whoVaccineIsFor.heading}
              component={styledVaccineContent.whoVaccineIsFor.component}
            />
            <Details
              title={styledVaccineContent.howToGetVaccine.heading}
              component={styledVaccineContent.howToGetVaccine.component}
            />
          </div>
          <a href={styledVaccineContent.webpageLink}>
            Learn more about the {VaccineDisplayNames[vaccineType]} vaccination
            on nhs.uk
          </a>
        </div>
      )}
    </>
  );
};

export default Vaccine;
