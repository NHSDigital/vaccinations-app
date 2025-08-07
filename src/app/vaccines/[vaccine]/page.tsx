"use server";

import LoadingSpinner from "@src/app/_components/loader/LoadingSpinner";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { getVaccineTypeFromUrlPath } from "@src/utils/path";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

interface VaccinePageProps {
  params: Promise<{ vaccine: string }>;
}

const VaccinePage = async ({ params }: VaccinePageProps) => {
  const { vaccine } = await params;
  const vaccineType: VaccineTypes | undefined = getVaccineTypeFromUrlPath(vaccine);

  // TODO: Remove promise
  // await new Promise(resolve => setTimeout(resolve, 5 * 1000));

  return vaccineType ? (
    <>
      <title>{`${VaccineInfo[vaccineType].heading} - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>
      <BackLink />
      <MainContent>
        <h1 className={"app-dynamic-page-title__heading"}>{`${VaccineInfo[vaccineType].heading}`}</h1>
        <Suspense fallback={<LoadingSpinner />}>
          <Vaccine vaccineType={vaccineType} />
        </Suspense>
      </MainContent>
    </>
  ) : (
    notFound()
  );
};

export default VaccinePage;
