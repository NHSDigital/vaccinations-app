import type { Metadata } from "next";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { JSX } from "react";
import { getPageCopyForVaccine } from "@src/services/content-api/contentFilter";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "6-in-1 Vaccine - NHS App",
};

const Vaccine6in1 = async (): Promise<JSX.Element> => {
  const contentPromise = getPageCopyForVaccine(VaccineTypes.SIX_IN_ONE);

  return (
    <div>
      <BackLink link="/schedule" />
      <VaccineContentProvider contentPromise={contentPromise}>
        <Vaccine name={"6-in-1"} vaccine={VaccineTypes.SIX_IN_ONE} />
      </VaccineContentProvider>
    </div>
  );
};

export default Vaccine6in1;
