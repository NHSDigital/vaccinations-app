import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { JSX } from "react";
import { getPageCopyForVaccine } from "@src/services/content-api/contentFilter";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";

export const dynamic = "force-dynamic";

const Vaccine6in1 = (): JSX.Element => {
  const contentPromise = getPageCopyForVaccine(VaccineTypes.SIX_IN_ONE);

  return (
    <div>
      <title>6-in-1 Vaccine - NHS App</title>
      <BackLink link="/schedule" />
      <VaccineContentProvider contentPromise={contentPromise}>
        <Vaccine name={"6-in-1"} vaccine={VaccineTypes.SIX_IN_ONE} />
      </VaccineContentProvider>
    </div>
  );
};

export default Vaccine6in1;
