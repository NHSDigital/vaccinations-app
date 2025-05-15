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

export const dynamic = "force-dynamic";

const VaccineFlu = (): JSX.Element => {
  const contentPromise: Promise<GetContentForVaccineResponse> =
    getContentForVaccine(VaccineTypes.FLU);

  return (
    <>
      <BackLink />
      <MainContent>
        <title>Flu Vaccine - NHS App</title>
        <ErrorBoundary
          fallback={<VaccineError vaccineType={VaccineTypes.FLU} />}
        >
          <VaccineContentProvider contentPromise={contentPromise}>
            <Vaccine vaccineType={VaccineTypes.FLU} />
          </VaccineContentProvider>
        </ErrorBoundary>
      </MainContent>
    </>
  );
};

export default VaccineFlu;
