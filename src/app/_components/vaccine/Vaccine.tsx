"use server";

import { auth } from "@project/auth";
import { FindOutMoreLink } from "@src/app/_components/content/FindOutMore";
import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { MoreInformation } from "@src/app/_components/content/MoreInformation";
import { EligibilityVaccinePageContent } from "@src/app/_components/eligibility/EligibilityVaccinePageContent";
import { RSVPregnancyInfo } from "@src/app/_components/vaccine-custom/RSVPregnancyInfo";
import { NhsNumber, VaccineDetails, VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { ContentErrorTypes, StyledVaccineContent } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { Eligibility, EligibilityErrorTypes } from "@src/services/eligibility-api/types";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { Session } from "next-auth";
import React, { JSX } from "react";

import styles from "./styles.module.css";

interface VaccineProps {
  vaccineType: VaccineTypes;
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

  let styledVaccineContent: StyledVaccineContent | undefined;
  let contentError: ContentErrorTypes | undefined;
  let eligibility: Eligibility | undefined;
  let eligibilityError: EligibilityErrorTypes | undefined;

  if (vaccineInfo.personalisedEligibilityStatusRequired) {
    [{ styledVaccineContent, contentError }, { eligibility, eligibilityError }] = await Promise.all([
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
      {/*/!* Overview section *!/*/}
      {contentError != ContentErrorTypes.CONTENT_LOADING_ERROR && styledVaccineContent != undefined && (
        <>
          <p data-testid="overview-text">{styledVaccineContent?.overview}</p>
        </>
      )}
      {/* Eligibility section for RSV */}
      {vaccineType === VaccineTypes.RSV && (
        <EligibilityVaccinePageContent
          vaccineType={vaccineType}
          eligibility={eligibility}
          eligibilityError={eligibilityError}
          howToGetVaccineOrFallback={howToGetVaccineOrFallback}
        />
      )}

      {/* Static eligibility section for RSV in pregnancy */}
      {vaccineType === VaccineTypes.RSV_PREGNANCY && (
        <RSVPregnancyInfo vaccineType={vaccineType} howToGetVaccineOrFallback={howToGetVaccineOrFallback} />
      )}

      {!vaccineInfo.personalisedEligibilityStatusRequired && <hr data-testid="more-information-hr" />}

      {/* Sections heading - H2 */}
      <h2 className="nhsuk-heading-s">{`More information about the ${vaccineInfo.displayName.midSentenceCase} vaccine`}</h2>
      {/* Expandable sections */}
      {contentError != ContentErrorTypes.CONTENT_LOADING_ERROR && styledVaccineContent != undefined ? (
        <MoreInformation styledVaccineContent={styledVaccineContent} vaccineType={vaccineType} />
      ) : (
        <FindOutMoreLink findOutMoreUrl={vaccineInfo.nhsWebpageLink} vaccineType={vaccineType} />
      )}
    </div>
  );
};

export default Vaccine;
