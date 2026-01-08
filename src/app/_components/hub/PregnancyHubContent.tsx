import CardLink from "@src/app/_components/nhs-app/CardLink";

const PregnancyHubContent = () => {
  return (
    <>
      <h2 className="nhsuk-heading-s">Routine vaccines for pregnancy</h2>
      <p>Some vaccines are recommended during pregnancy to protect the health of you and your baby.</p>
      <ul className="nhsapp-cards nhsapp-cards--stacked" data-testid={"vaccine-cardlinks-adults"}>
        <CardLink title={"Vaccines during pregnancy"} link={"/vaccines-during-pregnancy"} />
      </ul>
    </>
  );
};

export { PregnancyHubContent };
