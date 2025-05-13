import { JSX } from "react";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { ErrorBoundary } from "react-error-boundary";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";

export const dynamic = "force-dynamic";

const VaccineShingles = (): JSX.Element => {
  const contentPromise: Promise<GetContentForVaccineResponse> =
    getContentForVaccine(VaccineTypes.SHINGLES);

  return (
    <div>
      <title>Shingles Vaccine - NHS App</title>
      <ErrorBoundary
        fallback={<VaccineError vaccineType={VaccineTypes.SHINGLES} />}
      >
        <VaccineContentProvider contentPromise={contentPromise}>
          <Vaccine vaccineType={VaccineTypes.SHINGLES} />
        </VaccineContentProvider>
      </ErrorBoundary>
    </div>
  );
};

export default VaccineShingles;
