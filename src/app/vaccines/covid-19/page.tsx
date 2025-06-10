import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { JSX } from "react";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import { ErrorBoundary } from "react-error-boundary";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";
import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-filter-service";
import { GetEligibilityForPersonResponse } from "@src/services/eligibility-api/types";

export const dynamic = "force-dynamic";

const vaccineType = VaccineTypes.COVID_19;

const VaccineCovid19 = (): JSX.Element => {
  const contentForCovid19: Promise<GetContentForVaccineResponse> =
    getContentForVaccine(vaccineType);
  const contentForEligibility: Promise<GetEligibilityForPersonResponse> =
    getEligibilityForPerson("dummy", vaccineType);

  return (
    <>
      <BackLink />
      <MainContent>
        <title>COVID-19 Vaccine - NHS App</title>
        <ErrorBoundary fallback={<VaccineError vaccineType={vaccineType} />}>
          <VaccineContentProvider
            contentForVaccine={contentForCovid19}
            contentForEligibility={contentForEligibility}
          >
            <Vaccine vaccineType={vaccineType} />
          </VaccineContentProvider>
        </ErrorBoundary>
      </MainContent>
    </>
  );
};

export default VaccineCovid19;
