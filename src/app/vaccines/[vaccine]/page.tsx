"use server";

import Loader from "@src/app/_components/loader/Loader";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { getVaccineTypeFromUrlPath } from "@src/utils/path";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface VaccinePageProps {
  params: Promise<{ vaccine: string }>;
}

const VaccinePage = async ({ params }: VaccinePageProps) => {
  const { vaccine } = await params;
  const vaccineType: VaccineTypes | undefined =
    getVaccineTypeFromUrlPath(vaccine);

  return vaccineType ? (
    <>
      <title>{`${VaccineInfo[vaccineType].heading} - NHS App`}</title>
      <BackLink />
      <MainContent>
        <h1
          className={"app-dynamic-page-title__heading"}
        >{`${VaccineInfo[vaccineType].heading}`}</h1>
        <ErrorBoundary fallback={<VaccineError />}>
          <Suspense fallback={<Loader />}>
            <Vaccine vaccineType={vaccineType} />
          </Suspense>
        </ErrorBoundary>
      </MainContent>
    </>
  ) : (
    notFound()
  );
};

export default VaccinePage;
