import CardLink from "@src/app/_components/nhs-app/CardLink";
import { getContent } from "@src/services/content-api/contentService";
import type { Metadata } from "next";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";

export const metadata: Metadata = {
  title: "Vaccination schedule",
};

export const dynamic = "force-dynamic";

const Schedule = async () => {
  const content = await getContent();
  return (
    <div>
      <BackLink link="/" />
      <h1 className="app-dynamic-page-title__heading">
        {metadata.title as string}
      </h1>
      <p className="">{content.description}</p>
      <h2 className="nhsuk-heading-s">Vaccines for babies under 1 year old</h2>
      <CardLink title={"6-in-1 vaccine"} link={"/vaccines/6-in-1"} />
    </div>
  );
};

export default Schedule;
