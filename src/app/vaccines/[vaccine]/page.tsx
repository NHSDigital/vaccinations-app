"use server";

import Loader from "@src/app/_components/loader/Loader";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { getVaccineTypeFromUrlPath } from "@src/utils/path";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface VaccinePageProps {
  params: Promise<{ vaccine: string }>;
}

const generateMetadata = async ({
  params,
}: VaccinePageProps): Promise<Metadata> => {
  const { vaccine } = await params;
  const vaccineType: VaccineTypes | undefined =
    getVaccineTypeFromUrlPath(vaccine);
  return vaccineType
    ? {
        title: `${VaccineInfo[vaccineType].displayName.capitalised} Vaccine - NHS App`,
      }
    : {};
};

const VaccinePage = async ({ params }: VaccinePageProps) => {
  const { vaccine } = await params;
  const vaccineType: VaccineTypes | undefined =
    getVaccineTypeFromUrlPath(vaccine);

  return vaccineType ? (
    <>
      <BackLink />
      <MainContent>
        <ErrorBoundary fallback={<VaccineError vaccineType={vaccineType} />}>
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

export { generateMetadata };
export default VaccinePage;
