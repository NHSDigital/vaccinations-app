"use server";

import { auth } from "@project/auth";
import { FindOutMoreLink } from "@src/app/_components/content/FindOutMore";
import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { MoreInformation } from "@src/app/_components/content/MoreInformation";
import { Overview } from "@src/app/_components/content/Overview";
import Recommendation from "@src/app/_components/content/Recommendation";
import { EligibilityActions } from "@src/app/_components/eligibility/EligibilityActions";
import { EligibilityVaccinePageContent } from "@src/app/_components/eligibility/EligibilityVaccinePageContent";
import WarningCallout from "@src/app/_components/nhs-frontend/WarningCallout";
import { RSVPregnancyInfo } from "@src/app/_components/vaccine-custom/RSVPregnancyInfo";
import { NhsNumber, VaccineDetails, VaccineInfo, VaccineType } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { ContentErrorTypes, StyledVaccineContent } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { EligibilityErrorTypes, EligibilityForPersonType } from "@src/services/eligibility-api/types";
import config from "@src/utils/config";
import { getNow } from "@src/utils/date";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { Session } from "next-auth";
import React, { JSX } from "react";

import styles from "./styles.module.css";

interface VaccineProps {
  vaccineType: VaccineType;
}

const VaccinePagePerformanceMarker = "vaccine-page";

const Vaccine = async ({ vaccineType }: VaccineProps) => {
  return await requestScopedStorageWrapper(VaccineComponent, { vaccineType });
};

const VaccineComponent = async ({ vaccineType }: VaccineProps): Promise<JSX.Element> => {
  profilePerformanceStart(VaccinePagePerformanceMarker);

  const session: Session | null = await auth();
  const nhsNumber: NhsNumber | undefined = session?.user.nhs_number as NhsNumber;
  const vaccineInfo: VaccineDetails = VaccineInfo[vaccineType];

  const campaigns = await config.CAMPAIGNS;
  const isCampaignActive: boolean = campaigns.isActive(vaccineType, await getNow());

  let styledVaccineContent: StyledVaccineContent | undefined;
  let contentError: ContentErrorTypes | undefined;
  let eligibilityForPerson: EligibilityForPersonType | undefined;

  if (vaccineInfo.personalisedEligibilityStatusRequired) {
    [{ styledVaccineContent, contentError }, eligibilityForPerson] = await Promise.all([
      getContentForVaccine(vaccineType),
      nhsNumber
        ? getEligibilityForPerson(vaccineType, nhsNumber)
        : {
            eligibility: undefined,
            eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
          },
    ]);
  } else {
    [{ styledVaccineContent, contentError }] = await Promise.all([getContentForVaccine(vaccineType)]);
  }

  const howToGetVaccineOrFallback = styledVaccineContent ? (
    styledVaccineContent.howToGetVaccine.component
  ) : (
    <HowToGetVaccineFallback vaccineType={vaccineType} />
  );

  profilePerformanceEnd(VaccinePagePerformanceMarker);

  return (
    <div className={styles.tableCellSpanHide}>
      {contentError != ContentErrorTypes.CONTENT_LOADING_ERROR && styledVaccineContent != undefined && (
        <>
          <Overview overview={styledVaccineContent.overview} vaccineType={vaccineType} />
          <Recommendation styledVaccineContent={styledVaccineContent} />
          {!isCampaignActive && (
            <WarningCallout styledVaccineContent={styledVaccineContent} vaccineType={vaccineType} />
          )}
          {isCampaignActive && <EligibilityActions actions={styledVaccineContent.actions} vaccineType={vaccineType} />}
          <Overview overview={styledVaccineContent.overviewConclusion} vaccineType={vaccineType} />
        </>
      )}

      {/* Eligibility section for RSV */}
      {vaccineType === VaccineType.RSV && eligibilityForPerson !== undefined && (
        <EligibilityVaccinePageContent
          vaccineType={vaccineType}
          eligibilityForPerson={eligibilityForPerson}
          howToGetVaccineOrFallback={howToGetVaccineOrFallback}
        />
      )}

      {/* Static eligibility section for RSV in pregnancy */}
      {vaccineType === VaccineType.RSV_PREGNANCY && (
        <RSVPregnancyInfo vaccineType={vaccineType} howToGetVaccineOrFallback={howToGetVaccineOrFallback} />
      )}

      {/* Sections heading - H2 */}
      <hr data-testid="more-information-hr" />
      <h2 className="nhsuk-heading-s">{`More information about the ${vaccineInfo.displayName.midSentenceCase} ${vaccineInfo.displayName.suffix}`}</h2>
      {/* Expandable sections */}
      {contentError != ContentErrorTypes.CONTENT_LOADING_ERROR && styledVaccineContent != undefined ? (
        <MoreInformation
          styledVaccineContent={styledVaccineContent}
          vaccineType={vaccineType}
          isCampaignActive={isCampaignActive}
        />
      ) : (
        <FindOutMoreLink findOutMoreUrl={vaccineInfo.nhsWebpageLink} vaccineType={vaccineType} />
      )}
    </div>
  );
};

export default Vaccine;
