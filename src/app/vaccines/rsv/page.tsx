import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { JSX } from "react";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";

export const dynamic = "force-dynamic";

const VaccineRsv = (): JSX.Element => {
  const contentPromise = getContentForVaccine(VaccineTypes.RSV);

  return (
    <div>
      <title>RSV Vaccine - NHS App</title>
      <BackLink link="/schedule" />
      <VaccineContentProvider contentPromise={contentPromise}>
        <Vaccine name={VaccineDisplayNames.RSV} />
      </VaccineContentProvider>
    </div>
  );
};

export default VaccineRsv;
