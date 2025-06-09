import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { JSX } from "react";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { ErrorBoundary } from "react-error-boundary";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";
import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-reader-service";
import { GetEligibilityForPersonResponse } from "@src/services/eligibility-api/types";

export const dynamic = "force-dynamic";

const vaccineType = VaccineTypes.SHINGLES;

const VaccineShingles = (): JSX.Element => {
  const contentForShingles: Promise<GetContentForVaccineResponse> =
    getContentForVaccine(vaccineType);
  const eligibilityContent: Promise<GetEligibilityForPersonResponse> =
    getEligibilityForPerson("dummy", vaccineType);

  return (
    <>
      <BackLink />
      <MainContent>
        <title>Shingles Vaccine - NHS App</title>
        <ErrorBoundary fallback={<VaccineError vaccineType={vaccineType} />}>
          <VaccineContentProvider
            contentForVaccine={contentForShingles}
            eligibilityContent={eligibilityContent}
          >
            <Vaccine vaccineType={vaccineType} />
          </VaccineContentProvider>
        </ErrorBoundary>
      </MainContent>
    </>
  );
};

export default VaccineShingles;
