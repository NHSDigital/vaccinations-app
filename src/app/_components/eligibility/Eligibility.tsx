"use server";

import { EligibilityStatus } from "@src/services/eligibility-api/types";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import React from "react";
import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-filter-service";
import { VaccineTypes } from "@src/models/vaccine";
import styles from "@src/app/_components/vaccine/styles.module.css";

interface EligibilityProps {
  vaccineType: VaccineTypes;
}

const Eligibility = async ({ vaccineType }: EligibilityProps) => {
  const { eligibilityStatus, eligibilityContent } =
    await getEligibilityForPerson("dummy", vaccineType);
  return (
    <div className={styles.tableCellSpanHide}>
      {eligibilityStatus === EligibilityStatus.NOT_ELIGIBLE && (
        <NonUrgentCareCard
          heading={<div>{eligibilityContent?.status.heading}</div>}
          content={<div>{eligibilityContent?.status.introduction}</div>}
        />
      )}
    </div>
  );
};

export { Eligibility };
