import { FeedbackBanner } from "@src/app/_components/feedback/FeedbackBanner";
import { TransitionLink } from "@src/app/_components/navigation/TransitionLink";
import CardLinkWithDescription from "@src/app/_components/nhs-app/CardLinkWithDescription";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { HUB_FEEDBACK_REFERRER_ID, NHS_TITLE_SUFFIX, VACCINES_FOR_PREGNANT_PAGE } from "@src/app/constants";
import { VaccineInfo, pregnancyVaccines } from "@src/models/vaccine";
import React, { JSX } from "react";

const VaccinesDuringPregnancy = (): JSX.Element => {
  return (
    <>
      <title>{`${VACCINES_FOR_PREGNANT_PAGE} - ${NHS_TITLE_SUFFIX}`}</title>

      <FeedbackBanner referrer={HUB_FEEDBACK_REFERRER_ID} />
      <BackLink />
      <MainContent>
        <h1 className={"nhsuk-heading-xl nhsuk-u-margin-bottom-5"}>{VACCINES_FOR_PREGNANT_PAGE}</h1>
        <ul className="nhsapp-cards nhsapp-cards--stacked">
          {pregnancyVaccines.map((cardDetails) => (
            <CardLinkWithDescription
              key={cardDetails.vaccineName}
              title={VaccineInfo[cardDetails.vaccineName].cardLinkTitle}
              description={cardDetails.cardLinkDescription}
              link={`/vaccines/${VaccineInfo[cardDetails.vaccineName].urlPath}`}
            />
          ))}
        </ul>
        <TransitionLink href={"/vaccines-for-all-ages"} className="nhsuk-button nhsuk-button--secondary">
          View vaccines for all ages
        </TransitionLink>
      </MainContent>
    </>
  );
};

export default VaccinesDuringPregnancy;
