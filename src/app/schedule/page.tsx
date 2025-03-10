import Card from "@src/app/_components/nhs/card";
import getContent from "@src/services/contentService";

export const dynamic = "force-dynamic";

const Schedule = async () => {
  const content = await getContent();
  return (
    <div>
      <h1 className="app-dynamic-page-title__heading">Vaccination schedule</h1>
      <p className="">{content.description}</p>
      <h2 className="nhsuk-heading-s">Vaccines for babies under 1 year old</h2>
      <Card title={"6-in-1 vaccine"} />
    </div>
  );
};

export default Schedule;
