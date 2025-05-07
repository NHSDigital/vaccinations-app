"use client";

import CardLink from "@src/app/_components/nhs-app/CardLink";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";

const Schedule = () => {
  return (
    <div>
      <title>Vaccines for all ages - NHS App</title>
      <BackLink link="/" />
      <h1 className="app-dynamic-page-title__heading">Vaccines for all ages</h1>
      <p className="">
        Find out about vaccinations for babies, children and adults, including
        why they&#39;re important and how to get them.
      </p>
      <h2 className="nhsuk-heading-s">Seasonal vaccinations</h2>
      <CardLink title={"Flu"} link={"/vaccines/flu"} />
      <h2 className="nhsuk-heading-s">Vaccines for adults</h2>
      <div className="nhsapp-cards nhsapp-cards--stacked">
        <CardLink title={"RSV"} link={"/vaccines/rsv"} />
        <CardLink title={"Shingles"} link={"/vaccines/shingles"} />
        <CardLink title={"Pneumococcal"} link={"/vaccines/pneumococcal"} />
      </div>
      <h2 className="nhsuk-heading-s">Vaccines for children aged 1 to 15</h2>
      <CardLink title={"Pneumococcal"} link={"/vaccines/pneumococcal"} />
      <h2 className="nhsuk-heading-s">Vaccines for babies under 1 year old</h2>
      <div className="nhsapp-cards nhsapp-cards--stacked">
        <CardLink title={"6-in-1"} link={"/vaccines/6-in-1"} />
        <CardLink title={"Pneumococcal"} link={"/vaccines/pneumococcal"} />
      </div>
    </div>
  );
};

export default Schedule;
