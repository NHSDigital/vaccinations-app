import type { Metadata } from "next";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { JSX } from "react";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { getPageCopyForVaccine } from "@src/services/content-api/contentFilter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "RSV Vaccine - NHS App",
};

const VaccineRsv = async (): Promise<JSX.Element> => {
  const contentPromise = getPageCopyForVaccine(VaccineTypes.RSV);

  return (
    <div>
      <BackLink link="/schedule" />
      <VaccineContentProvider contentPromise={contentPromise}>
        <Vaccine name={"RSV"} vaccine={VaccineTypes.RSV} />
      </VaccineContentProvider>
    </div>
  );
};

export default VaccineRsv;
