import BackLink from "@src/app/_components/nhs-frontend/BackLink";

import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { JSX } from "react";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { StyledVaccineContent } from "@src/services/content-api/parsers/content-styling-service";

export const dynamic = "force-dynamic";

const Vaccine6in1 = (): JSX.Element => {
  const contentPromise: Promise<StyledVaccineContent> = getContentForVaccine(
    VaccineTypes.SIX_IN_ONE,
  );

  return (
    <div>
      <title>6-in-1 Vaccine - NHS App</title>
      <BackLink link="/schedule" />
      <VaccineContentProvider contentPromise={contentPromise}>
        <Vaccine
          name={VaccineDisplayNames.SIX_IN_ONE}
          vaccine={VaccineTypes.SIX_IN_ONE}
        />
      </VaccineContentProvider>
    </div>
  );
};

export default Vaccine6in1;
