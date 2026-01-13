import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import CardLink from "@src/app/_components/nhs-app/CardLink";
import InsetText from "@src/app/_components/nhs-frontend/InsetText";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { HUB_FEEDBACK_REFERRER_ID, NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import { VaccineContentUrlPaths, VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { ContentErrorTypes, StyledVaccineContent } from "@src/services/content-api/types";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import React from "react";

import { FeedbackBanner } from "../_components/feedback/FeedbackBanner";

export const dynamic = "force-dynamic";

const ifContentHasLoadedSuccessfully = (
  styledVaccineContent: StyledVaccineContent | undefined,
  contentError: ContentErrorTypes | undefined,
) => {
  return contentError != ContentErrorTypes.CONTENT_LOADING_ERROR && styledVaccineContent != undefined;
};

const VaccinationsHub = async () => {
  return requestScopedStorageWrapper(vaccinationsHubPage);
};

const vaccinationsHubPage = async () => {
  const { styledVaccineContent, contentError } = await getContentForVaccine(VaccineTypes.RSV);

  return (
    <>
      <title>{`${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <FeedbackBanner referrer={HUB_FEEDBACK_REFERRER_ID} />
      <BackToNHSAppLink />
      <MainContent>
        {/* Page heading - H1 */}
        <h1 className={"app-dynamic-page-title__heading"}>{SERVICE_HEADING}</h1>

        {ifContentHasLoadedSuccessfully(styledVaccineContent, contentError) && (
          <p data-testid="overview-text">{styledVaccineContent?.overview}</p>
        )}

        <InsetText
          content={
            <p>
              We&apos;re expanding this service. Soon you&apos;ll be able to check and book more NHS vaccinations here.
            </p>
          }
        />

        {/* List of vaccines */}
        <div className="nhsapp-cards nhsapp-cards--stacked">
          <CardLink
            title={`${VaccineInfo[VaccineTypes.RSV].heading}`}
            link={`/vaccines/${VaccineContentUrlPaths.RSV}`}
          />
          <CardLink
            title={`${VaccineInfo[VaccineTypes.RSV_PREGNANCY].heading}`}
            link={`/vaccines/${VaccineContentUrlPaths.RSV_PREGNANCY}`}
          />
        </div>
      </MainContent>
    </>
  );
};

export default VaccinationsHub;
