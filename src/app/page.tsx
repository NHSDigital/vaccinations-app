"use client";

import CardLink from "@src/app/_components/nhs-app/CardLink";
import styles from "./styles.module.css";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import Link from "next/link";

export const dynamic = "force-dynamic";

const VaccinationsHub = () => {
  return (
    <div>
      <title>Vaccinations - NHS App</title>
      <BackLink link="/" />
      <h1>Vaccinations</h1>
      <p>
        Find out about vaccinations for babies, children and adults, including
        why they&#39;re important and how to get them.
      </p>
      <div className={styles.subheading}>
        <div>
          <h2 className="nhsuk-heading-s">Vaccinations</h2>
        </div>
      </div>
      <p>
        Based on your age, these vaccinations may be relevant - some
        vaccinations may not be needed or have already been given.
      </p>
      <div className="nhsapp-cards nhsapp-cards--stacked">
        <CardLink title={"RSV vaccine"} link={"/vaccines/rsv"} />
        <CardLink title={"Flu vaccine"} link={"/vaccines/flu"} />
      </div>
      <div>
        <Link prefetch={false} href="/schedule">
          View all vaccinations
        </Link>
      </div>
    </div>
  );
};

export default VaccinationsHub;
