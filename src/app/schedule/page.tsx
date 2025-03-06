import Card from "@src/app/_components/nhs/card";

const Schedule = () => {
  return (
    <div>
      <h1 className="app-dynamic-page-title__heading">Vaccination schedule</h1>
      <p className="">
        [Placeholder] Find out about vaccinations for babies, children and
        adults, including why they&#39;re important and how to get them.
      </p>
      <h2 className="nhsuk-heading-s">Vaccines for babies under 1 year old</h2>
      <Card title={"6-in-1 vaccine"} key={1} />
    </div>
  );
};

export default Schedule;
