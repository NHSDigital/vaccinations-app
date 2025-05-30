import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { JSX } from "react";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { ErrorBoundary } from "react-error-boundary";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";

export const dynamic = "force-dynamic";

const VaccineRsv = (): JSX.Element => {
  const contentPromise = getContentForVaccine(VaccineTypes.RSV);

  return (
    <>
      <BackLink />
      <MainContent>
        <title>RSV Vaccine - NHS App</title>
        <ErrorBoundary
          fallback={<VaccineError vaccineType={VaccineTypes.RSV} />}
        >
          <VaccineContentProvider contentPromise={contentPromise}>
            <Vaccine vaccineType={VaccineTypes.RSV} />
          </VaccineContentProvider>
        </ErrorBoundary>
      </MainContent>
    </>
  );
};

export default VaccineRsv;
