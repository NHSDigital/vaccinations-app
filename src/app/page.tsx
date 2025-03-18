"use client";

import CardLink from "@src/app/_components/nhs-app/CardLink";
import styles from "./styles.module.css";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import { useContent } from "@src/app/_components/providers/ContentProvider";
import { use } from "react";

// export const dynamic = "force-dynamic";

const VaccinationsHub = () => {
  const { contentPromise } = useContent();
  const content = use(contentPromise);

  return (
    <div>
      <BackLink link="/" />
      <h1>{content.about.name}</h1>
      <p>{content.description}</p>
      <div className={styles.subheading}>
        <div>
          <h3>{content.about.name}</h3>
        </div>
        <div>
          <a href="/schedule">View all</a>
        </div>
      </div>
      <p>
        Based on your age, these vaccinations may be relevant - some
        vaccinations may not be needed or have already been given.
      </p>
      <CardLink title={"6-in-1 vaccine"} link={"/vaccines/6-in-1"} />
      <CardLink title={"RSV vaccine"} link={"/vaccines/rsv"} />
    </div>
  );
};

export default VaccinationsHub;
