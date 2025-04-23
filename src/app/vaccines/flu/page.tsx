import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import { JSX } from "react";

import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";

export const dynamic = "force-dynamic";

const VaccineFlu = (): JSX.Element => {
  const contentPromise = getContentForVaccine(VaccineTypes.FLU);

  return (
    <div>
      <title>Flu Vaccine - NHS App</title>
      <BackLink link="/schedule" />
      <VaccineContentProvider contentPromise={contentPromise}>
        <Vaccine name={VaccineDisplayNames.FLU} />
      </VaccineContentProvider>
    </div>
  );
};

export default VaccineFlu;
