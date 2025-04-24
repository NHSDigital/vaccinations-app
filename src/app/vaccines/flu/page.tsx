import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import { JSX } from "react";

import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { StyledVaccineContent } from "@src/services/content-api/parsers/content-styling-service";
import { ErrorBoundary } from "react-error-boundary";
import VaccineError from "@src/app/vaccines/vaccine-error/page";

export const dynamic = "force-dynamic";

const VaccineFlu = (): JSX.Element => {
  const contentPromise: Promise<StyledVaccineContent> = getContentForVaccine(
    VaccineTypes.FLU,
  );

  return (
    <div>
      <title>Flu Vaccine - NHS App</title>
      <BackLink link="/schedule" />
      <ErrorBoundary fallback={<VaccineError vaccineType={VaccineTypes.FLU} />}>
        <VaccineContentProvider contentPromise={contentPromise}>
          <Vaccine name={VaccineDisplayNames.FLU} />
        </VaccineContentProvider>
      </ErrorBoundary>
    </div>
  );
};

export default VaccineFlu;
