"use client";

import CardLink from "@src/app/_components/nhs-app/CardLink";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { VaccineContentUrlPaths, VaccineInfo } from "@src/models/vaccine";

export const dynamic = "force-dynamic";

const VaccinationsHub = () => {
  return (
    <>
      {/*TODO: This should go back to NHS app, requires app integration */}
      <BackLink />
      <MainContent>
        <title>Check and book an RSV vaccination - NHS App</title>
        <h1>Check and book an RSV vaccination</h1>
        <div className="nhsapp-cards nhsapp-cards--stacked">
          <CardLink
            title={`${VaccineInfo.RSV.displayName.capitalised} for older adults`}
            link={`/vaccines/${VaccineContentUrlPaths.RSV}`}
          />
          <CardLink
            title={`${VaccineInfo.RSV_PREGNANCY.displayName.capitalised} vaccine in pregnancy`}
            link={`/vaccines/${VaccineContentUrlPaths.RSV_PREGNANCY}`}
          />
        </div>
      </MainContent>
    </>
  );
};

export default VaccinationsHub;
