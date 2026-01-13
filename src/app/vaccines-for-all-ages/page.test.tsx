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

  const expectedVaccinesForEachAgeSection = [
    { section: AgeSectionTestId.ADULTS, cardTitle: "Pneumococcal", path: "/vaccines/pneumococcal-vaccine" },
    { section: AgeSectionTestId.ADULTS, cardTitle: "Flu", path: "/vaccines/flu-vaccine" },
    { section: AgeSectionTestId.ADULTS, cardTitle: "Shingles", path: "/vaccines/shingles-vaccine" },
    { section: AgeSectionTestId.ADULTS, cardTitle: "RSV", path: "/vaccines/rsv" },
    { section: AgeSectionTestId.ADULTS, cardTitle: "COVID-19", path: "/vaccines/covid-19-vaccine" },
    {
      section: AgeSectionTestId.PREGNANCY,
      cardTitle: "Whooping cough (pertussis) in pregnancy",
      path: "/vaccines/whooping-cough-vaccination",
    },
    { section: AgeSectionTestId.PREGNANCY, cardTitle: "RSV in pregnancy", path: "/vaccines/rsv-pregnancy" },
    { section: AgeSectionTestId.PREGNANCY, cardTitle: "Flu in pregnancy", path: "/vaccines/flu-vaccine-in-pregnancy" },
    { section: AgeSectionTestId.CHILDREN_SCHOOL_AGED, cardTitle: "HPV", path: "/vaccines/hpv-vaccine" },
    { section: AgeSectionTestId.CHILDREN_SCHOOL_AGED, cardTitle: "MenACWY", path: "/vaccines/menacwy-vaccine" },
    {
      section: AgeSectionTestId.CHILDREN_SCHOOL_AGED,
      cardTitle: "Td/IPV (3-in-1 teenage booster)",
      path: "/vaccines/td-ipv-vaccine-3-in-1-teenage-booster",
    },
    {
      section: AgeSectionTestId.CHILDREN_SCHOOL_AGED,
      cardTitle: "Flu for school-aged children (Reception to Year 11)",
      path: "/vaccines/flu-vaccine-for-school-aged-children",
    },
    {
      section: AgeSectionTestId.CHILDREN_PRESCHOOL,
      cardTitle: "MMRV (measles, mumps, rubella and chickenpox)",
      path: "/vaccines/mmrv-vaccine",
    },
    { section: AgeSectionTestId.CHILDREN_PRESCHOOL, cardTitle: "MenB", path: "/vaccines/menb-vaccine-for-children" },
    { section: AgeSectionTestId.CHILDREN_PRESCHOOL, cardTitle: "Pneumococcal", path: "/vaccines/pneumococcal-vaccine" },
    { section: AgeSectionTestId.CHILDREN_PRESCHOOL, cardTitle: "6-in-1", path: "/vaccines/6-in-1-vaccine" },
    {
      section: AgeSectionTestId.CHILDREN_PRESCHOOL,
      cardTitle: "4-in-1 pre-school booster",
      path: "/vaccines/4-in-1-preschool-booster-vaccine",
    },
    {
      section: AgeSectionTestId.CHILDREN_PRESCHOOL,
      cardTitle: "Flu for children aged 2 to 3",
      path: "/vaccines/flu-vaccine-for-children",
    },
    { section: AgeSectionTestId.BABIES, cardTitle: "6-in-1", path: "/vaccines/6-in-1-vaccine" },
    { section: AgeSectionTestId.BABIES, cardTitle: "Rotavirus", path: "/vaccines/rotavirus-vaccine" },
    { section: AgeSectionTestId.BABIES, cardTitle: "MenB", path: "/vaccines/menb-vaccine-for-children" },
  ];

  it.each(expectedVaccinesForEachAgeSection)(
    `should render $cardTitle link for $section`,
    ({ section, cardTitle, path }) => {
      render(<VaccinesForAllAges />);

      assertCardLinkIsPresentInSection(cardTitle, path, section);
    },
  );

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
