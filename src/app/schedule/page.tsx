"use client";

import CardLink from "@src/app/_components/nhs-app/CardLink";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { VaccineInfo } from "@src/models/vaccine";

const Schedule = () => {
  return (
    <>
      <BackLink />
      <MainContent>
        <title>Vaccines for all ages - NHS App</title>
        <h1 className="app-dynamic-page-title__heading">
          Vaccines for all ages
        </h1>
        <p className="">
          Find out about vaccinations for babies, children and adults, including
          why they&#39;re important and how to get them.
        </p>
        <h2 className="nhsuk-heading-s">Seasonal vaccinations</h2>
        <div className="nhsapp-cards nhsapp-cards--stacked">
          <CardLink
            title={VaccineInfo.FLU.displayName.capitalised}
            link={"/vaccines/flu"}
          />
          <CardLink
            title={VaccineInfo.COVID_19.displayName.capitalised}
            link={"/vaccines/covid-19"}
          />
        </div>
        <h2 className="nhsuk-heading-s">Vaccines for adults</h2>
        <div className="nhsapp-cards nhsapp-cards--stacked">
          <CardLink
            title={VaccineInfo.RSV.displayName.capitalised}
            link={"/vaccines/rsv"}
          />
          <CardLink
            title={VaccineInfo.SHINGLES.displayName.capitalised}
            link={"/vaccines/shingles"}
          />
          <CardLink
            title={VaccineInfo.PNEUMOCOCCAL.displayName.capitalised}
            link={"/vaccines/pneumococcal"}
          />
        </div>
        <h2 className="nhsuk-heading-s">Vaccines for children aged 1 to 15</h2>
        <div className="nhsapp-cards nhsapp-cards--stacked">
          <CardLink
            title={VaccineInfo.MENACWY.displayName.capitalised}
            link={"/vaccines/menacwy"}
          />
          <CardLink
            title={VaccineInfo.PNEUMOCOCCAL.displayName.capitalised}
            link={"/vaccines/pneumococcal"}
          />
        </div>
        <h2 className="nhsuk-heading-s">
          Vaccines for babies under 1 year old
        </h2>
        <div className="nhsapp-cards nhsapp-cards--stacked">
          <CardLink
            title={VaccineInfo.SIX_IN_ONE.displayName.capitalised}
            link={"/vaccines/6-in-1"}
          />
          <CardLink
            title={VaccineInfo.PNEUMOCOCCAL.displayName.capitalised}
            link={"/vaccines/pneumococcal"}
          />
        </div>
      </MainContent>
    </>
  );
};

export default Schedule;
