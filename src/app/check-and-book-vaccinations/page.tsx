"use server";

import { auth } from "@project/auth";
import { FeedbackBanner } from "@src/app/_components/feedback/FeedbackBanner";
import { AgeBasedHubCards } from "@src/app/_components/hub/AgeBasedHubCards";
import { AtRiskHubExpander } from "@src/app/_components/hub/AtRiskHubExpander";
import { PregnancyHubContent } from "@src/app/_components/hub/PregnancyHubContent";
import { TransitionLink } from "@src/app/_components/navigation/TransitionLink";
import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { HUB_FEEDBACK_REFERRER_ID, NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import { AgeBasedHubDetails, AgeBasedHubInfo, AgeGroup } from "@src/models/ageBasedHub";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const VaccinationsHub = async () => {
  const session: Session | null = await auth();
  const ageGroup: AgeGroup = session?.user.age_group as AgeGroup;
  if (ageGroup === AgeGroup.UNKNOWN_AGE_GROUP) {
    redirect("/service-failure");
  }

  const hubInfoForAgeGroup: AgeBasedHubDetails | undefined = AgeBasedHubInfo[ageGroup];

  return (
    <>
      <title>{`${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <FeedbackBanner referrer={HUB_FEEDBACK_REFERRER_ID} />
      <BackToNHSAppLink />
      <MainContent>
        <h1 className={"nhsuk-heading-xl nhsuk-u-margin-bottom-5"}>{SERVICE_HEADING}</h1>
        <AgeBasedHubCards ageGroup={ageGroup} />
        <AtRiskHubExpander />
        {hubInfoForAgeGroup?.styledWarningCallout}
        {(hubInfoForAgeGroup?.showPregnancyHubContent || hubInfoForAgeGroup === undefined) && <PregnancyHubContent />}
        <TransitionLink href={"/vaccines-for-all-ages"} className="nhsuk-button nhsuk-button--secondary">
          View vaccines for all ages
        </TransitionLink>
      </MainContent>
    </>
  );
};

export default VaccinationsHub;
