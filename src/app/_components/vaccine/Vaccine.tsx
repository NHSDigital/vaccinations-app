"use client";

import styles from "./styles.module.css";

import { JSX, use } from "react";
import Details from "@src/app/_components/nhs-frontend/Details";
import { useVaccineContentContextValue } from "@src/app/_components/providers/VaccineContentProvider";
import { VaccineDetails, VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import {
  ContentErrorTypes,
  GetContentForVaccineResponse,
} from "@src/services/content-api/types";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";
import InsetText from "@src/app/_components/nhs-frontend/InsetText";

interface VaccineProps {
  vaccineType: VaccineTypes;
}

const Vaccine = ({ vaccineType }: VaccineProps): JSX.Element => {
  const { contentPromise } = useVaccineContentContextValue();
  const { styledVaccineContent, contentError }: GetContentForVaccineResponse =
    use(contentPromise);

  const vaccineInfo: VaccineDetails = VaccineInfo[vaccineType];

  return (
    <div className={styles.tableCellSpanHide}>
      {contentError === ContentErrorTypes.CONTENT_LOADING_ERROR ||
      styledVaccineContent === undefined ? (
        <VaccineError vaccineType={vaccineType} />
      ) : (
        <div>
          <h1 className="app-dynamic-page-title__heading">{`${vaccineInfo.displayName} vaccine`}</h1>
          <p data-testid="overview-text">{styledVaccineContent.overview}</p>

          {vaccineInfo.overviewInsetText && (
            <div data-testid="overview-inset-text">
              <InsetText key={0} content={vaccineInfo.overviewInsetText} />
            </div>
          )}

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
          <a href={styledVaccineContent.webpageLink} target="_blank">
            Find out more about the {vaccineInfo.displayName.toLowerCase()}{" "}
            vaccination
          </a>
        </div>
      )}
    </div>
  );
};

export default Vaccine;
