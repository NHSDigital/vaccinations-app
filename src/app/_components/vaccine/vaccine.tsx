import { JSX } from "react";
import { VaccineTypes } from "@src/models/vaccine";
import Details from "@src/app/_components/nhs-frontend/Details";
import { getStyledContentForVaccine } from "@src/services/content-api/contentStylingService";

interface VaccineProps {
  name: string;
  vaccine: VaccineTypes;
}

const Vaccine = async (props: VaccineProps): Promise<JSX.Element> => {
  const styledContent = await getStyledContentForVaccine(props.vaccine);

  return (
    <div>
      <h1 className="app-dynamic-page-title__heading">{props.name} Vaccine</h1>
      <p>{styledContent.overview}</p>

      <h2 className="nhsuk-heading-s">More information</h2>
      <div className="nhsuk-expander-group">
        <Details
          title={styledContent.whatVaccineIsFor.heading}
          component={styledContent.whatVaccineIsFor.component}
        />
        <Details
          title={styledContent.whoVaccineIsFor.heading}
          component={styledContent.whoVaccineIsFor.component}
        />
        <Details
          title={styledContent.howToGetVaccine.heading}
          component={styledContent.howToGetVaccine.component}
        />
      </div>
      <a href={styledContent.webpageLink}>
        Find out more about {props.name} vaccination on the NHS.uk
      </a>
    </div>
  );
};

export default Vaccine;
