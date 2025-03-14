import type { Metadata } from "next";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import Details from "@src/app/_components/nhs-frontend/Details";

import {
  getPageCopyForVaccine,
  VaccinePageContent,
} from "@src/services/content-api/contentFilter";
import { VaccineTypes } from "@src/models/vaccine";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "6-in-1 vaccine",
};

const Vaccine6in1 = async () => {
  const sixInOneContent: VaccinePageContent = await getPageCopyForVaccine(
    VaccineTypes.SIX_IN_ONE,
  );

  return (
    <div>
      <BackLink link="/schedule" />
      <h1 className="app-dynamic-page-title__heading">
        {metadata.title as string}
      </h1>
      <p>{sixInOneContent.overview}</p>

      <h2 className="nhsuk-heading-s">More information</h2>
      <div className="nhsuk-expander-group">
        <Details
          summaryText={sixInOneContent.whatVaccineIsFor.heading}
          text={sixInOneContent.whatVaccineIsFor.bodyText}
        />
        <Details
          summaryText={sixInOneContent.whoVaccineIsFor.heading}
          text={sixInOneContent.whoVaccineIsFor.bodyText}
        />
        <Details
          summaryText={sixInOneContent.howToGetVaccine.heading}
          text={sixInOneContent.howToGetVaccine.bodyText}
        />
      </div>
      <a href={sixInOneContent.webpageLink}>
        Find out more about 6-in-1 vaccination on the NHS.uk
      </a>
    </div>
  );
};

export default Vaccine6in1;
