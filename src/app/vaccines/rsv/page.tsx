import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { JSX } from "react";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import VaccineError from "@src/app/vaccines/vaccine-error/page";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

const VaccineRsv = (): JSX.Element => {
  const contentPromise = getContentForVaccine(VaccineTypes.RSV);

  return (
    <div>
      <title>RSV Vaccine - NHS App</title>
      <BackLink link="/schedule" />
      <ErrorBoundary fallback={<VaccineError vaccineType={VaccineTypes.RSV} />}>
        <VaccineContentProvider contentPromise={contentPromise}>
          <Vaccine vaccineType={VaccineTypes.RSV} />
        </VaccineContentProvider>
      </ErrorBoundary>
    </div>
  );
};

export default VaccineRsv;
