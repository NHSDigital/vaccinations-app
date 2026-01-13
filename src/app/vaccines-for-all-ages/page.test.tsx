import VaccinesForAllAges from "@src/app/vaccines-for-all-ages/page";
import { assertBackLinkIsPresent } from "@test-data/utils/back-link-helpers";
import { render, screen, within } from "@testing-library/react";

enum AgeSectionTestId {
  ADULTS = "vaccine-cardlinks-adults",
  PREGNANCY = "vaccine-cardlinks-pregnancy",
  CHILDREN_SCHOOL_AGED = "vaccine-cardlinks-children-school-aged",
  CHILDREN_PRESCHOOL = "vaccine-cardlinks-children-preschool",
  BABIES = "vaccine-cardlinks-babies",
}

jest.mock("@src/app/_components/nhs-frontend/BackLink", () => jest.fn(() => <div data-testid="back-link"></div>));

jest.mock("@src/app/_components/hub/AtRiskHubExpander", () => ({
  AtRiskHubExpander: jest
    .fn()
    .mockImplementation(() => <p data-testid={"at-risk-hub-expander"}>At risk hub expander test</p>),
}));

describe("VaccinesForAllAges", () => {
  it("should render page main heading", () => {
    render(<VaccinesForAllAges />);

    const mainHeading: HTMLElement = screen.getByRole("heading", { name: "Vaccines for all ages", level: 1 });

    expect(mainHeading).toBeVisible();
  });

  it("should render overview text", () => {
    render(<VaccinesForAllAges />);

    const overviewText: HTMLElement = screen.getByText(
      "It's important that vaccines are given on time for the best protection, but if you or your child missed a vaccine, contact your GP to catch up.",
    );

    expect(overviewText).toBeVisible();
  });

  it("should render at-risk hub expander", () => {
    render(<VaccinesForAllAges />);

    const atRiskHubExpander: HTMLElement = screen.getByTestId("at-risk-hub-expander");
    expect(atRiskHubExpander).toBeVisible();
  });

  it("should render all subheadings", () => {
    render(<VaccinesForAllAges />);

    assertSubheadingIsPresent("Routine vaccines for adults");
    assertSubheadingIsPresent("Routine vaccines for pregnancy");
    assertSubheadingIsPresent("Routine vaccines for school-aged children 4 to 16 (Reception to Year 11)");
    assertSubheadingIsPresent("Routine vaccines for pre-school children under 4");
    assertSubheadingIsPresent("Routine vaccines for babies under 1 year old");
  });

  it("should render all vaccine card links", () => {
    render(<VaccinesForAllAges />);

    assertCardLinkIsPresentInSection("Pneumococcal", "/vaccines/pneumococcal-vaccine", AgeSectionTestId.ADULTS);
    assertCardLinkIsPresentInSection("Flu", "/vaccines/flu-vaccine", AgeSectionTestId.ADULTS);
    assertCardLinkIsPresentInSection("Shingles", "/vaccines/shingles-vaccine", AgeSectionTestId.ADULTS);
    assertCardLinkIsPresentInSection("RSV", "/vaccines/rsv", AgeSectionTestId.ADULTS);
    assertCardLinkIsPresentInSection("COVID-19", "/vaccines/covid-19-vaccine", AgeSectionTestId.ADULTS);

    assertCardLinkIsPresentInSection(
      "Whooping cough (pertussis) in pregnancy",
      "/vaccines/whooping-cough-vaccination",
      AgeSectionTestId.PREGNANCY,
    );
    assertCardLinkIsPresentInSection("RSV in pregnancy", "/vaccines/rsv-pregnancy", AgeSectionTestId.PREGNANCY);
    assertCardLinkIsPresentInSection(
      "Flu in pregnancy",
      "/vaccines/flu-vaccine-in-pregnancy",
      AgeSectionTestId.PREGNANCY,
    );

    assertCardLinkIsPresentInSection("HPV", "/vaccines/hpv-vaccine", AgeSectionTestId.CHILDREN_SCHOOL_AGED);
    assertCardLinkIsPresentInSection("MenACWY", "/vaccines/menacwy-vaccine", AgeSectionTestId.CHILDREN_SCHOOL_AGED);
    assertCardLinkIsPresentInSection(
      "Td/IPV (3-in-1 teenage booster)",
      "/vaccines/td-ipv-vaccine-3-in-1-teenage-booster",
      AgeSectionTestId.CHILDREN_SCHOOL_AGED,
    );
    assertCardLinkIsPresentInSection(
      "Flu for school-aged children (Reception to Year 11)",
      "/vaccines/flu-vaccine-for-school-aged-children",
      AgeSectionTestId.CHILDREN_SCHOOL_AGED,
    );

    assertCardLinkIsPresentInSection(
      "MMRV (measles, mumps, rubella and chickenpox)",
      "/vaccines/mmrv-vaccine",
      AgeSectionTestId.CHILDREN_PRESCHOOL,
    );
    assertCardLinkIsPresentInSection(
      "MenB",
      "/vaccines/menb-vaccine-for-children",
      AgeSectionTestId.CHILDREN_PRESCHOOL,
    );
    assertCardLinkIsPresentInSection(
      "Pneumococcal",
      "/vaccines/pneumococcal-vaccine",
      AgeSectionTestId.CHILDREN_PRESCHOOL,
    );
    assertCardLinkIsPresentInSection("6-in-1", "/vaccines/6-in-1-vaccine", AgeSectionTestId.CHILDREN_PRESCHOOL);
    assertCardLinkIsPresentInSection(
      "4-in-1 pre-school booster",
      "/vaccines/4-in-1-preschool-booster-vaccine",
      AgeSectionTestId.CHILDREN_PRESCHOOL,
    );
    assertCardLinkIsPresentInSection(
      "Flu for children aged 2 to 3",
      "/vaccines/flu-vaccine-for-children",
      AgeSectionTestId.CHILDREN_PRESCHOOL,
    );

    assertCardLinkIsPresentInSection("6-in-1", "/vaccines/6-in-1-vaccine", AgeSectionTestId.BABIES);
    assertCardLinkIsPresentInSection("Rotavirus", "/vaccines/rotavirus-vaccine", AgeSectionTestId.BABIES);
    assertCardLinkIsPresentInSection("MenB", "/vaccines/menb-vaccine-for-children", AgeSectionTestId.BABIES);
    assertCardLinkIsPresentInSection("Pneumococcal", "/vaccines/pneumococcal-vaccine", AgeSectionTestId.BABIES);
  });

  it("should render back link", () => {
    render(<VaccinesForAllAges />);

    assertBackLinkIsPresent(screen);
  });
});

const assertSubheadingIsPresent = (text: string) => {
  const subheading: HTMLElement = screen.getByRole("heading", { name: text, level: 2 });

  expect(subheading).toBeVisible();
};

const assertCardLinkIsPresentInSection = (text: string, path: string, section: string) => {
  const ageSection = screen.getByTestId(section);

  const link: HTMLElement = within(ageSection).getByRole("link", { name: text });

  expect(link).toBeVisible();
  expect(link.getAttribute("href")).toEqual(path);
};
