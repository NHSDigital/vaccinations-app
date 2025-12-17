const AtRiskText = () => {
  return (
    <>
      <h3 className="nhsuk-heading-xs nhsuk-u-margin-bottom-0">At-risk babies and children</h3>
      <p> Speak to your GP or health visitor.</p>
      <h3 className="nhsuk-heading-xs nhsuk-u-margin-bottom-0">Long-term health conditions</h3>
      <p>
        Speak to your GP or{" "}
        <a href={"https://www.nhs.uk/service-search/pharmacy/find-a-pharmacy/"} target="_blank" rel="noopener">
          pharmacy
        </a>{" "}
        about what vaccinations you might need.
      </p>
      <h3 className="nhsuk-heading-xs nhsuk-u-margin-bottom-0">Sexual health</h3>
      <p>
        {" "}
        NHS vaccines are recommended for men who have sex with men, sex workers or other people at higher risk. Ask at
        your{" "}
        <a
          href="https://www.nhs.uk/nhs-services/sexual-health-services/find-a-sexual-health-clinic/"
          target="_blank"
          rel="noopener"
        >
          sexual health clinic
        </a>
        .
      </p>
      <h3 className="nhsuk-heading-xs nhsuk-u-margin-bottom-0">Travel</h3>
      <p>
        {" "}
        If you&#39;re planning to{" "}
        <a href="https://www.nhs.uk/vaccinations/travel-vaccinations/" target="_blank" rel="noopener">
          travel outside the UK
        </a>
        , you may need to be vaccinated against some of the serious diseases found in other parts of the world. Speak to
        your GP.
      </p>
      <h3 className="nhsuk-heading-xs nhsuk-u-margin-bottom-0">Occupation</h3>
      <p> Check with your employer about what vaccinations you might need.</p>
    </>
  );
};

export { AtRiskText };
