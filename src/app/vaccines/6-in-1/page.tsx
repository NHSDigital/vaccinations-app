import type { Metadata } from "next";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { JSX } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "6-in-1 Vaccine - NHS App",
};

const Vaccine6in1 = async (): Promise<JSX.Element> => {
  return (
    <div>
      <BackLink link="/schedule" />
      <Vaccine name={"6-in-1"} vaccine={VaccineTypes.SIX_IN_ONE} />
    </div>
  );
};

export default Vaccine6in1;
