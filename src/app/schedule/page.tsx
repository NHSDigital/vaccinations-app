"use client";

import CardLink from "@src/app/_components/nhs-app/CardLink";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";

const Schedule = () => {
  return (
    <div>
      <title>Vaccination schedule - NHS App</title>
      <BackLink link="/" />
      <h1 className="app-dynamic-page-title__heading">Vaccination schedule</h1>
      <p className="">
        Find out about vaccinations for babies, children and adults, including
        why they&#39;re important and how to get them.
      </p>
      <h2 className="nhsuk-heading-s">Vaccines for Seasonal diseases</h2>
      <CardLink title={"Flu vaccine"} link={"/vaccines/flu"} />
      <h2 className="nhsuk-heading-s">Vaccines for Adults</h2>
      <CardLink title={"RSV vaccine"} link={"/vaccines/rsv"} />
      <h2 className="nhsuk-heading-s">Vaccines for babies under 1 year old</h2>
      <CardLink title={"6-in-1 vaccine"} link={"/vaccines/6-in-1"} />
    </div>
  );
};

export default Schedule;
