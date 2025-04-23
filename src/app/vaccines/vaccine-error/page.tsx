import { JSX } from "react";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";
import styles from "@src/app/styles.module.css";

interface VaccineProps {
  vaccineType: VaccineTypes;
}

const VaccineError = (props: VaccineProps): JSX.Element => {
  return (
    <div>
      <BackLink link="/schedule" />
      <h1 className="app-dynamic-page-title__heading">{`${VaccineDisplayNames[props.vaccineType]} vaccine`}</h1>
      <div className={styles.subheading}>
        <div>
          <h2 className="nhsuk-heading-s">Vaccine content is unavailable</h2>
        </div>
        <p>
          Sorry, there is a problem showing vaccine information. Come back
          later, or read about vaccinations on NHS.uk.
        </p>
      </div>
    </div>
  );
};

export default VaccineError;
