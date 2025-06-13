"use server";

import { EligibilityStatus } from "@src/services/eligibility-api/types";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import React from "react";
import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-filter-service";
import { VaccineTypes } from "@src/models/vaccine";
import styles from "@src/app/_components/vaccine/styles.module.css";
import { isMockedDevSession } from "@src/utils/feature-flags";
import { mockSession } from "@src/utils/mocks";
import { auth } from "@project/auth";
import { Session } from "next-auth";

interface EligibilityProps {
  vaccineType: VaccineTypes;
}

const Eligibility = async ({ vaccineType }: EligibilityProps) => {
  const session: Session | null = (await isMockedDevSession())
    ? mockSession()
    : await auth();
  if (!session) {
    return;
  }

  const { eligibilityStatus, eligibilityContent } =
    await getEligibilityForPerson(session.user.nhs_number, vaccineType);

  return (
    <div className={styles.tableCellSpanHide} role="eligibility">
      {eligibilityStatus === EligibilityStatus.NOT_ELIGIBLE && (
        <NonUrgentCareCard
          heading={<div>{eligibilityContent?.status.heading}</div>}
          content={
            <div>
              <p className="nhsuk-u-margin-bottom-2">
                {eligibilityContent?.status.introduction}
              </p>
              <ul>
                {eligibilityContent?.status.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          }
        />
      )}
    </div>
  );
};

export { Eligibility };
