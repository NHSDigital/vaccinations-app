import type { Metadata } from "next";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { JSX } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "RSV Vaccine - NHS App",
};

const VaccineRsv = async (): Promise<JSX.Element> => {
  return (
    <div>
      <BackLink link="/schedule" />
      <Vaccine name={"RSV"} vaccine={VaccineTypes.RSV} />
    </div>
  );
};

export default VaccineRsv;
