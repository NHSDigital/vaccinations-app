"use server";

import { auth } from "@project/auth";
import { FindOutMoreLink } from "@src/app/_components/content/FindOutMore";
import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { MoreInformation } from "@src/app/_components/content/MoreInformation";
import { Eligibility as EligibilityComponent } from "@src/app/_components/eligibility/Eligibility";
import { RSVEligibilityFallback } from "@src/app/_components/eligibility/RSVEligibilityFallback";
import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import Details from "@src/app/_components/nhs-frontend/Details";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { HEADINGS } from "@src/app/constants";
import { NhsNumber, VaccineDetails, VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { ContentErrorTypes, StyledVaccineContent } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { Eligibility, EligibilityErrorTypes } from "@src/services/eligibility-api/types";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { Session } from "next-auth";
import React, { JSX } from "react";

import styles from "./styles.module.css";

interface VaccineProps {
  vaccineType: VaccineTypes;
}

const VaccinePagePerformanceMarker = "vaccine-page";

const Vaccine = async ({ vaccineType }: VaccineProps): Promise<JSX.Element> => {
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
      {/* Personalised eligibility section for RSV */}
      {vaccineType === VaccineTypes.RSV && !eligibilityError && eligibility?.content && eligibility?.status && (
        <EligibilityComponent eligibilityContent={eligibility.content} />
      )}

      {/* Fallback eligibility section for RSV */}
      {vaccineType === VaccineTypes.RSV && eligibilityError && (
        <RSVEligibilityFallback howToGetVaccineFallback={howToGetVaccineOrFallback} vaccineType={vaccineType} />
      )}

      {/* Static eligibility section for RSV in pregnancy */}
      {vaccineType === VaccineTypes.RSV_PREGNANCY && (
        <NonUrgentCareCard
          heading={<div>The RSV vaccine is recommended if you:</div>}
          content={
            <div className={styles.zeroMarginBottom}>
              <ul>
                <li>are over 28 weeks pregnant</li>
                <li>have not had the vaccine during this pregnancy</li>
              </ul>
            </div>
          }
        />
      )}

      {/* How-to-get-vaccine section for RSV in pregnancy */}
      {vaccineType === VaccineTypes.RSV_PREGNANCY && (
        <>
          <Details title={HEADINGS.HOW_TO_GET_VACCINE} component={howToGetVaccineOrFallback} notExpandable={true} />
          <PharmacyBookingInfo vaccineType={vaccineType} />
        </>
      )}

      {/* Sections heading - H2 */}
      <h2 className="nhsuk-heading-s">More information about the {vaccineInfo.displayName.midSentenceCase} vaccine</h2>

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
