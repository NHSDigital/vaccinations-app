"use client";

import styles from "./styles.module.css";

import React, { JSX, use } from "react";
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
const EXPANDER_HEADINGS = {
  WHAT_VACCINE_IS_FOR: "What this vaccine is for",
  WHO_SHOULD_HAVE_VACCINE: "Who should have this vaccine",
  HOW_TO_GET_VACCINE: "How to get the vaccine",
};

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
          <h1 className="app-dynamic-page-title__heading">{`${vaccineInfo.displayName.capitalised} vaccine`}</h1>
          <p data-testid="overview-text">{styledVaccineContent.overview}</p>

          {vaccineInfo.overviewInsetText && (
            <div data-testid="overview-inset-text">
              <InsetText
                key={0}
                content={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: vaccineInfo.overviewInsetText,
                    }}
                  />
                }
              />
            </div>
          )}

          <h2 className="nhsuk-heading-s">
            More information about the {vaccineInfo.displayName.lowercase}{" "}
            vaccine
          </h2>
          <div className="nhsuk-expander-group">
            {styledVaccineContent.whatVaccineIsFor ? (
              <Details
                title={EXPANDER_HEADINGS.WHAT_VACCINE_IS_FOR}
                component={styledVaccineContent.whatVaccineIsFor.component}
              />
            ) : undefined}
            <Details
              title={EXPANDER_HEADINGS.WHO_SHOULD_HAVE_VACCINE}
              component={styledVaccineContent.whoVaccineIsFor.component}
            />
            <Details
              title={EXPANDER_HEADINGS.HOW_TO_GET_VACCINE}
              component={styledVaccineContent.howToGetVaccine.component}
            />
          </div>
          <p>
            <a
              href={styledVaccineContent.webpageLink}
              target="_blank"
              rel="noopener"
            >
              Find out more about the {vaccineInfo.displayName.lowercase}{" "}
              vaccination
            </a>{" "}
            including side effects, allergies and ingredients.
          </p>
        </div>
      )}
    </div>
  );
};

export default Vaccine;
