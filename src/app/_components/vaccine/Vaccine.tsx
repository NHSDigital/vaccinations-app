"use server";

import { auth } from "@project/auth";
import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { MoreInformationSection } from "@src/app/_components/content/MoreInformationSection";
import { NonPersonalisedVaccinePageContent } from "@src/app/_components/content/NonPersonalisedVaccinePageContent";
import { EligibilityVaccinePageContent } from "@src/app/_components/eligibility/EligibilityVaccinePageContent";
import { RSVPregnancyInfo } from "@src/app/_components/vaccine-custom/RSVPregnancyInfo";
import { NhsNumber, VaccineDetails, VaccineInfo, VaccineType } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { ContentErrorTypes, StyledVaccineContent } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { EligibilityErrorTypes, EligibilityForPersonType } from "@src/services/eligibility-api/types";
import { getCampaignState } from "@src/utils/campaigns/campaign-state-evaluator";
import { CampaignState } from "@src/utils/campaigns/campaignState";
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

const shouldShowHowToGetExpander = async (vaccineType: VaccineType, campaignState: CampaignState) => {
  const vaccineInfo: VaccineDetails = VaccineInfo[vaccineType];
  const isCampaignClosedOrNotSupported =
    campaignState === CampaignState.UNSUPPORTED || campaignState === CampaignState.CLOSED;

  return vaccineInfo.removeHowToGetExpanderFromMoreInformationSection ? false : isCampaignClosedOrNotSupported;
};

const VaccineComponent = async ({ vaccineType }: VaccineProps): Promise<JSX.Element> => {
  profilePerformanceStart(VaccinePagePerformanceMarker);

  const session: Session | null = await auth();
  const nhsNumber: NhsNumber | undefined = session?.user.nhs_number as NhsNumber;
  const vaccineInfo: VaccineDetails = VaccineInfo[vaccineType];

  const campaignState = await getCampaignState(vaccineType);

  let styledVaccineContent: StyledVaccineContent | undefined;
  let contentError: ContentErrorTypes | undefined;
  let eligibilityForPerson: EligibilityForPersonType | undefined;

  const showHowToGetExpander = await shouldShowHowToGetExpander(vaccineType, campaignState);

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
        <NonPersonalisedVaccinePageContent
          styledVaccineContent={styledVaccineContent}
          vaccineType={vaccineType}
          campaignState={campaignState}
        />
      )}

      {/* Eligibility section for RSV */}
      {vaccineInfo.personalisedEligibilityStatusRequired && eligibilityForPerson !== undefined && (
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

      <hr />
      <MoreInformationSection
        styledVaccineContent={styledVaccineContent}
        vaccineType={vaccineType}
        showHowToGetSection={showHowToGetExpander}
      />
    </div>
  );
};

export default Vaccine;
export { shouldShowHowToGetExpander };
