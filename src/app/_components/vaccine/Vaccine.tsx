"use server";

import { NBSBookingAction } from "@src/app/_components/nbs/NBSBookingAction";
import Details from "@src/app/_components/nhs-frontend/Details";
import InsetText from "@src/app/_components/nhs-frontend/InsetText";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import {
  VaccineContentUrlPaths,
  VaccineDetails,
  VaccineInfo,
  VaccineTypes,
  vaccineTypeToUrlPath,
} from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { ContentErrorTypes } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { EligibilityErrorTypes } from "@src/services/eligibility-api/types";

import React, { JSX } from "react";
import styles from "./styles.module.css";
import { Eligibility } from "@src/app/_components/eligibility/Eligibility";
import { Session } from "next-auth";
import { auth } from "@project/auth";
import { SSO_TO_NBS_ROUTE } from "@src/app/api/sso-to-nbs/constants";
import { EligibilityFallback } from "@src/app/_components/eligibility/EligibilityFallback";
import { MoreInformation } from "@src/app/_components/content/MoreInformation";
import { HEADINGS } from "@src/app/constants";
import { FindOutMoreLink } from "@src/app/_components/content/FindOutMore";

interface VaccineProps {
  vaccineType: VaccineTypes;
}

const Vaccine = async ({ vaccineType }: VaccineProps): Promise<JSX.Element> => {
  const session: Session | null = await auth();
  const nhsNumber: string | undefined = session?.user.nhs_number;

  const [{ styledVaccineContent, contentError }, { eligibility, eligibilityError }] = await Promise.all([
    getContentForVaccine(vaccineType),
    nhsNumber
      ? getEligibilityForPerson(vaccineType, nhsNumber)
      : {
          eligibility: undefined,
          eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
        },
  ]);

  const vaccineInfo: VaccineDetails = VaccineInfo[vaccineType];
  const vaccinePath: VaccineContentUrlPaths = vaccineTypeToUrlPath[vaccineType];
  const nbsSSOLink = `${SSO_TO_NBS_ROUTE}?vaccine=${vaccinePath}`;

  const howToGetVaccineFallback = styledVaccineContent ? (
    styledVaccineContent.howToGetVaccine.component
  ) : (
    <>
      Find out <a href={vaccineInfo.nhsHowToGetWebpageLink}>how to get</a> an {vaccineInfo.displayName.midSentenceCase}{" "}
      vaccination
    </>
  );

  return (
    <div className={styles.tableCellSpanHide}>
      {/* Cross-linking of related pages */}
      {vaccineInfo.overviewInsetText && (
        <div data-testid="overview-inset-text">
          <InsetText
            key={0}
            content={
              <div
                className={styles.zeroMarginBottom}
                dangerouslySetInnerHTML={{
                  __html: vaccineInfo.overviewInsetText,
                }}
              />
            }
          />
        </div>
      )}

      {/* Personalised eligibility section for RSV */}
      {vaccineType === VaccineTypes.RSV &&
        !eligibilityError &&
        eligibility &&
        eligibility.content &&
        eligibility.status && (
          <Eligibility eligibilityStatus={eligibility.status} eligibilityContent={eligibility.content} />
        )}

      {/* Fallback eligibility section for RSV */}
      {vaccineType === VaccineTypes.RSV && eligibilityError && (
        <EligibilityFallback howToGetVaccineFallback={howToGetVaccineFallback} nbsLink={nbsSSOLink} />
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
        <Details title={HEADINGS.HOW_TO_GET_VACCINE} component={howToGetVaccineFallback} notExpandable={true} />
      )}

      {/* NBS booking button action for RSV */}
      {vaccineType === VaccineTypes.RSV && (
        <NBSBookingAction vaccineType={vaccineType} displayText={"Continue to booking"} renderAs={"button"} />
      )}

      {/* Sections heading - H2 */}
      <h2 className="nhsuk-heading-s">More information about the {vaccineInfo.displayName.midSentenceCase} vaccine</h2>

      {/* Expandable sections */}
      {contentError != ContentErrorTypes.CONTENT_LOADING_ERROR && styledVaccineContent != undefined ? (
        <MoreInformation
          styledVaccineContent={styledVaccineContent}
          vaccineType={vaccineType}
          vaccineInfo={vaccineInfo}
        />
      ) : (
        <FindOutMoreLink findOutMoreUrl={vaccineInfo.nhsWebpageLink} vaccineInfo={vaccineInfo} />
      )}
    </div>
  );
};

export default Vaccine;
