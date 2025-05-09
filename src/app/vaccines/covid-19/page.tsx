import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { JSX } from "react";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import { ErrorBoundary } from "react-error-boundary";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";

export const dynamic = "force-dynamic";

const VaccineCovid19 = (): JSX.Element => {
  const contentPromise: Promise<GetContentForVaccineResponse> =
    getContentForVaccine(VaccineTypes.COVID_19);

  return (
    <div>
      <title>COVID-19 Vaccine - NHS App</title>
      <BackLink link="/schedule" />
      <ErrorBoundary
        fallback={<VaccineError vaccineType={VaccineTypes.COVID_19} />}
      >
        <VaccineContentProvider contentPromise={contentPromise}>
          <Vaccine vaccineType={VaccineTypes.COVID_19} />
        </VaccineContentProvider>
      </ErrorBoundary>
    </div>
  );
};

export default VaccineCovid19;
