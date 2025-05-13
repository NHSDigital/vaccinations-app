"use client";

import CardLink from "@src/app/_components/nhs-app/CardLink";
import styles from "./styles.module.css";
import Link from "next/link";
import { VaccineInfo } from "@src/models/vaccine";

export const dynamic = "force-dynamic";

const VaccinationsHub = () => {
  return (
    <div>
      <title>Vaccinations - NHS App</title>
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
        <CardLink
          title={VaccineInfo.COVID_19.displayName.capitalised}
          link={"/vaccines/covid-19"}
        />
        <CardLink
          title={VaccineInfo.FLU.displayName.capitalised}
          link={"/vaccines/flu"}
        />
        <CardLink
          title={VaccineInfo.MENACWY.displayName.capitalised}
          link={"/vaccines/menacwy"}
        />
        <CardLink
          title={VaccineInfo.PNEUMOCOCCAL.displayName.capitalised}
          link={"/vaccines/pneumococcal"}
        />
        <CardLink
          title={VaccineInfo.RSV.displayName.capitalised}
          link={"/vaccines/rsv"}
        />
        <CardLink
          title={VaccineInfo.SHINGLES.displayName.capitalised}
          link={"/vaccines/shingles"}
        />
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
