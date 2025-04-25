enum VaccineTypes {
  SIX_IN_ONE = "SIX_IN_ONE",
  RSV = "RSV",
  FLU = "FLU",
}

type VaccineDetails = {
  displayName: string;
  overviewInsetText?: string;
};

const VaccineInfo: Record<VaccineTypes, VaccineDetails> = {
  [VaccineTypes.SIX_IN_ONE]: {
    displayName: "6-in-1",
  },
  [VaccineTypes.RSV]: {
    displayName: "RSV",
  },
  [VaccineTypes.FLU]: {
    displayName: "Flu",
    overviewInsetText:
      '<p>This page is about the flu vaccine for adults. There are also pages about the <a href="https://www.nhs.uk/vaccinations/child-flu-vaccine/">children\'s flu vaccine</a> and <a href="https://www.nhs.uk/pregnancy/keeping-well/flu-jab/">flu jab in pregnancy</a>.</p>',
  },
};

export { VaccineTypes, VaccineInfo };
