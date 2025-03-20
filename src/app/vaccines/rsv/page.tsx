import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { JSX } from "react";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { getStyledContentForVaccine } from "@src/services/content-api/contentStylingService";

export const dynamic = "force-dynamic";

const VaccineRsv = (): JSX.Element => {
  const contentPromise = getStyledContentForVaccine(VaccineTypes.RSV);

  return (
    <div>
      <title>RSV Vaccine - NHS App</title>
      <BackLink link="/schedule" />
      <VaccineContentProvider contentPromise={contentPromise}>
        <Vaccine name={"RSV"} vaccine={VaccineTypes.RSV} />
      </VaccineContentProvider>
    </div>
  );
};

export default VaccineRsv;
