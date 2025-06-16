"use server";

import CardLink from "@src/app/_components/nhs-app/CardLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";
import {
  VaccineContentUrlPaths,
  VaccineInfo,
  VaccineTypes,
} from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { ContentErrorTypes } from "@src/services/content-api/types";
import React from "react";

const headingText = "Check and book an RSV vaccination";

const VaccinationsHub = async () => {
  const { styledVaccineContent, contentError } = await getContentForVaccine(
    VaccineTypes.RSV,
  );

  return (
    <>
      <title>{`${headingText} - NHS App`}</title>

      <MainContent>
        {/* Page heading - H1 */}
        <h1 className={"app-dynamic-page-title__heading"}>{headingText}</h1>

        {contentError === ContentErrorTypes.CONTENT_LOADING_ERROR ||
        styledVaccineContent === undefined ? (
          // Error summary on content loading error
          <VaccineError />
        ) : (
          <>
            {/* Overview paragraph */}
            <p data-testid="overview-text">{styledVaccineContent?.overview}</p>

            {/* List of vaccines */}
            <div className="nhsapp-cards nhsapp-cards--stacked">
              <CardLink
                title={`${VaccineInfo.RSV.displayName.capitalised} for older adults`}
                link={`/vaccines/${VaccineContentUrlPaths.RSV}`}
              />
              <CardLink
                title={`${VaccineInfo.RSV_PREGNANCY.displayName.capitalised} vaccine in pregnancy`}
                link={`/vaccines/${VaccineContentUrlPaths.RSV_PREGNANCY}`}
              />
            </div>
          </>
        )}
      </MainContent>
    </>
  );
};

export default VaccinationsHub;
