"use server";

import { auth } from "@project/auth";
import { AgeBasedHubCards } from "@src/app/_components/hub/AgeBasedHubCards";
import { AtRiskHubExpander } from "@src/app/_components/hub/AtRiskHubExpander";
import { PregnancyHubContent } from "@src/app/_components/hub/PregnancyHubContent";
import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import { AgeGroup } from "@src/models/ageBasedHub";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

const VaccinationsHub = async () => {
  // TODO: VIA-630 add missing request scoped storage wrapper. Check other new pages and add as required

  const session: Session | null = await auth();
  const ageGroup: AgeGroup = session?.user.age_group as AgeGroup;

  return (
    <>
      <title>{`${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>
      <BackToNHSAppLink />
      <MainContent>
        <h1 className={"nhsuk-heading-xl nhsuk-u-margin-bottom-3"}>{SERVICE_HEADING}</h1>
        <AgeBasedHubCards ageGroup={ageGroup} />
        {/*TODO VIA-630 control visibility of the following components based on age*/}
        <AtRiskHubExpander />
        <PregnancyHubContent />
        <Link href={"/vaccines-for-all-ages"} className={"nhsuk-button nhsuk-button--secondary"}>
          View vaccines for all ages
        </Link>
      </MainContent>
    </>
  );
};

export default VaccinationsHub;
