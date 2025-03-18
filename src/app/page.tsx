import CardLink from "@src/app/_components/nhs-app/CardLink";
import styles from "./styles.module.css";
import { JSX } from "react";
import type { Metadata } from "next";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";

export const metadata: Metadata = {
  title: "Vaccinations - NHS App",
};

const VaccinationsHub = async (): Promise<JSX.Element> => {
  return (
    <div>
      <BackLink link="/" />
      <h1>Vaccinations</h1>
      <p>
        Find out about vaccinations for babies, children and adults, including
        why they&#39;re important and how to get them.
      </p>
      <div className={styles.subheading}>
        <div>
          <h3>Vaccinations</h3>
        </div>
        <div>
          <a href="/schedule">View all</a>
        </div>
      </div>
      <p>
        Based on your age, these vaccinations may be relevant - some
        vaccinations may not be needed or have already been given.
      </p>
      <div className="nhsapp-cards nhsapp-cards--stacked">
        <CardLink title={"6-in-1 vaccine"} link={"/vaccines/6-in-1"} />
        <CardLink title={"RSV vaccine"} link={"/vaccines/rsv"} />
      </div>
    </div>
  );
};

export default VaccinationsHub;
