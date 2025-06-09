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
import { getEligibilityContentForPerson } from "@src/services/eligibility-api/gateway/eligibility-reader-service";
import { GetEligibilityForPersonResponse } from "@src/services/eligibility-api/types";

export const dynamic = "force-dynamic";

const vaccineType = VaccineTypes.SIX_IN_ONE;

const Vaccine6in1 = (): JSX.Element => {
  const contentFor6in1: Promise<GetContentForVaccineResponse> =
    getContentForVaccine(vaccineType);
  const contentForEligibility: Promise<GetEligibilityForPersonResponse> =
    getEligibilityContentForPerson("dummy", vaccineType);

  return (
    <>
      <BackLink />
      <MainContent>
        <title>6-in-1 Vaccine - NHS App</title>
        <ErrorBoundary fallback={<VaccineError vaccineType={vaccineType} />}>
          <VaccineContentProvider
            contentForVaccine={contentFor6in1}
            contentForEligibility={contentForEligibility}
          >
            <Vaccine vaccineType={vaccineType} />
          </VaccineContentProvider>
        </ErrorBoundary>
      </MainContent>
    </>
  );
};

export default Vaccine6in1;
