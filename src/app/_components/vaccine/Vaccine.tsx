"use server";

import { NBSBookingAction } from "@src/app/_components/nbs/NBSBookingAction";
import Details from "@src/app/_components/nhs-frontend/Details";
import InsetText from "@src/app/_components/nhs-frontend/InsetText";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";
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

interface VaccineProps {
  vaccineType: VaccineTypes;
}

const EXPANDER_HEADINGS = {
  WHAT_VACCINE_IS_FOR: "What this vaccine is for",
  WHO_SHOULD_HAVE_VACCINE: "Who should have this vaccine",
  HOW_TO_GET_VACCINE: "How to get the vaccine",
};

const Vaccine = async ({ vaccineType }: VaccineProps): Promise<JSX.Element> => {
  const session: Session | null = await auth();
  const nhsNumber: string | undefined = session?.user.nhs_number;

  const [
    { styledVaccineContent, contentError },
    { eligibility, eligibilityError },
  ] = await Promise.all([
    getContentForVaccine(vaccineType),
    nhsNumber
      ? getEligibilityForPerson(vaccineType, nhsNumber)
      : {
          eligibility: {
            status: undefined,
            content: undefined,
          },
          eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
        },
  ]);

  const vaccineInfo: VaccineDetails = VaccineInfo[vaccineType];
  const vaccinePath: VaccineContentUrlPaths = vaccineTypeToUrlPath[vaccineType];
  const nbsSSOLink = `${SSO_TO_NBS_ROUTE}?vaccine=${vaccinePath}`;

  return contentError === ContentErrorTypes.CONTENT_LOADING_ERROR ||
    styledVaccineContent === undefined ? (
    // Error summary on content loading error
    <VaccineError />
  ) : (
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
          <Eligibility
            eligibilityStatus={eligibility.status}
            eligibilityContent={eligibility.content}
          />
        )}

      {vaccineType === VaccineTypes.RSV && eligibilityError && (
        <div>
          <NonUrgentCareCard
            heading={<div>{"You should have RSV vaccine if you:"}</div>}
            content={
              <div className={styles.zeroMarginBottom}>
                <ul>
                  <li key={1}>{"are aged between 75 and 79"}</li>
                  <li key={2}>{"turned 80 after 1 September 2024"}</li>
                </ul>
              </div>
            }
          />
          <h3>{"If you think you should have this vaccine"}</h3>
          <p>{"Contact your GP surgery to book your RSV vaccination."}</p>
          <p>
            {
              "Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email."
            }
          </p>
          <p>
            {
              "You do not need to wait to be contacted before booking your vaccination."
            }
          </p>
          <p>{"In some areas you can "}</p>
          <a href={nbsSSOLink}>book an RSV vaccination in a pharmacy</a>
        </div>
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
        <Details
          title={EXPANDER_HEADINGS.HOW_TO_GET_VACCINE}
          component={styledVaccineContent.howToGetVaccine.component}
          notExpandable={true}
        />
      )}

      {/* NBS booking button action for RSV */}
      {vaccineType === VaccineTypes.RSV && (
        <NBSBookingAction
          vaccineType={vaccineType}
          displayText={"Continue to booking"}
          renderAs={"button"}
        />
      )}

      {/* Sections heading - H2 */}
      <h2 className="nhsuk-heading-s">
        More information about the {vaccineInfo.displayName.lowercase} vaccine
      </h2>

      {/* Expandable sections */}
      <div className="nhsuk-expander-group">
        {/* What-vaccine-is-for expandable section */}
        {styledVaccineContent.whatVaccineIsFor && (
          <Details
            title={EXPANDER_HEADINGS.WHAT_VACCINE_IS_FOR}
            component={styledVaccineContent.whatVaccineIsFor.component}
          />
        )}

        {/* Who-vaccine-is-for expandable section */}
        <Details
          title={EXPANDER_HEADINGS.WHO_SHOULD_HAVE_VACCINE}
          component={styledVaccineContent.whoVaccineIsFor.component}
        />

        {/* How-to-get-vaccine expandable section for all vaccines except RSV in pregnancy */}
        {vaccineType !== VaccineTypes.RSV_PREGNANCY && (
          <Details
            title={EXPANDER_HEADINGS.HOW_TO_GET_VACCINE}
            component={styledVaccineContent.howToGetVaccine.component}
          />
        )}
      </div>

      {/* More information on nhs.uk link */}
      <p>
        <a
          href={styledVaccineContent.webpageLink}
          target="_blank"
          rel="noopener"
        >
          Find out more about the {vaccineInfo.displayName.lowercase} vaccine
        </a>{" "}
        including side effects, allergies and ingredients.
      </p>
    </div>
  );
};

export default Vaccine;
