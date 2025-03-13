import { getContent } from "@src/services/content-api/contentService";
import CardLink from "@src/app/_components/nhs-app/CardLink";
import styles from "./styles.module.css";
import { JSX } from "react";

export const dynamic = "force-dynamic";

const VaccinationsHub = async (): Promise<JSX.Element> => {
  const content = await getContent();

  return (
    <div>
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
