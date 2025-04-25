import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { JSX } from "react";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import VaccineError from "@src/app/vaccines/vaccine-error/page";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

const Vaccine6in1 = (): JSX.Element => {
  const contentPromise: Promise<GetContentForVaccineResponse> =
    getContentForVaccine(VaccineTypes.SIX_IN_ONE);

  return (
    <div>
      <title>6-in-1 Vaccine - NHS App</title>
      <BackLink link="/schedule" />
      <ErrorBoundary
        fallback={<VaccineError vaccineType={VaccineTypes.SIX_IN_ONE} />}
      >
        <VaccineContentProvider contentPromise={contentPromise}>
          <Vaccine vaccineType={VaccineTypes.SIX_IN_ONE} />
        </VaccineContentProvider>
      </ErrorBoundary>
    </div>
  );
};

export default Vaccine6in1;
