import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import { JSX } from "react";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { ErrorBoundary } from "react-error-boundary";
import VaccineError from "@src/app/vaccines/vaccine-error/page";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";

export const dynamic = "force-dynamic";

const VaccineFlu = (): JSX.Element => {
  const contentPromise: Promise<GetContentForVaccineResponse> =
    getContentForVaccine(VaccineTypes.FLU);

  return (
    <div>
      <title>Flu Vaccine - NHS App</title>
      <BackLink link="/schedule" />
      <ErrorBoundary fallback={<VaccineError vaccineType={VaccineTypes.FLU} />}>
        <VaccineContentProvider contentPromise={contentPromise}>
          <Vaccine vaccineType={VaccineTypes.FLU} />
        </VaccineContentProvider>
      </ErrorBoundary>
    </div>
  );
};

export default VaccineFlu;
