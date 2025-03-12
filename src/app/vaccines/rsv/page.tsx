import { JSX } from "react";
import { getContentForVaccine } from "@src/services/content-api/contentService";
import { VaccineTypes } from "@src/models/vaccine";

export const dynamic = "force-dynamic";

const VaccineRsv = async (): Promise<JSX.Element> => {
  const content = await getContentForVaccine(VaccineTypes.RSV);

  return (
    <div>
      <h1 className="app-dynamic-page-title__heading">{content.about.name}</h1>
      <p className="">{content.hasPart[0].description}</p>
      <h2 className="nhsuk-heading-s">More information</h2>
      <a href={content.webpage}>
        Find out more about RSV vaccination on the NHS.uk
      </a>
    </div>
  );
};

export default VaccineRsv;
