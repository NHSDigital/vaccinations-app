import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-reader-service";
import { JSX } from "react";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { ErrorBoundary } from "react-error-boundary";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";

export const dynamic = "force-dynamic";

const vaccineType = VaccineTypes.RSV;
const VaccineRsv = (): JSX.Element => {
  const contentPromise = getContentForVaccine(vaccineType);
  const eligibilityPromise = getEligibilityForPerson("dummy", vaccineType);

  return (
    <>
      <BackLink />
      <MainContent>
        <title>RSV Vaccine - NHS App</title>
        <ErrorBoundary fallback={<VaccineError vaccineType={vaccineType} />}>
          <VaccineContentProvider
            contentPromise={contentPromise}
            eligibilityPromise={eligibilityPromise}
          >
            <Vaccine vaccineType={vaccineType} />
          </VaccineContentProvider>
        </ErrorBoundary>
      </MainContent>
    </>
  );
};

export default VaccineRsv;
