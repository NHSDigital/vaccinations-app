import VaccinesForAllAges from "@src/app/vaccines-for-all-ages/page";
import { assertBackLinkIsPresent } from "@test-data/utils/back-link-helpers";
import { render, screen, within } from "@testing-library/react";

enum AgeSectionTestId {
  ADULTS = "vaccine-cardlinks-adults",
  CHILDREN = "vaccine-cardlinks-children",
  PREGNANCY = "vaccine-cardlinks-pregnancy",
  BABIES = "vaccine-cardlinks-babies",
}

jest.mock("@src/app/_components/nhs-frontend/BackLink", () => jest.fn(() => <div data-testid="back-link"></div>));

describe("VaccinesForAllAges", () => {
  it("should render page main heading", () => {
    render(<VaccinesForAllAges />);

    const mainHeading: HTMLElement = screen.getByRole("heading", { name: "Vaccines for all ages", level: 1 });

    expect(mainHeading).toBeVisible();
  });

  it("should render overview text", () => {
    render(<VaccinesForAllAges />);

    const overviewText: HTMLElement = screen.getByText(
      "Find out about vaccinations for babies, children and adults, including why they're important and how to get them.",
    );

    expect(overviewText).toBeVisible();
  });

  it("should render all subheadings", () => {
    render(<VaccinesForAllAges />);

    assertSubheadingIsPresent("Vaccines for adults");
    assertSubheadingIsPresent("Vaccines for pregnancy");
    assertSubheadingIsPresent("Vaccines for children aged 1 to 15");
    assertSubheadingIsPresent("Vaccines for babies under 1 year old");
  });

  it("should render all vaccine card links", () => {
    render(<VaccinesForAllAges />);

    assertCardLinkIsPresentInSection("RSV", "/vaccines/rsv", AgeSectionTestId.ADULTS);
    assertCardLinkIsPresentInSection("Pneumococcal", "/vaccines/pneumococcal-vaccine", AgeSectionTestId.ADULTS);

    assertCardLinkIsPresentInSection("RSV in pregnancy", "/vaccines/rsv-pregnancy", AgeSectionTestId.PREGNANCY);

    assertCardLinkIsPresentInSection(
      "Td/IPV (3-in-1 teenage booster)",
      "/vaccines/td-ipv-vaccine-3-in-1-teenage-booster",
      AgeSectionTestId.CHILDREN,
    );
    assertCardLinkIsPresentInSection("MenACWY", "/vaccines/menacwy-vaccine", AgeSectionTestId.CHILDREN);
    assertCardLinkIsPresentInSection("HPV", "/vaccines/hpv-vaccine", AgeSectionTestId.CHILDREN);
    assertCardLinkIsPresentInSection("MMR", "/vaccines/mmr-vaccine", AgeSectionTestId.CHILDREN);
    assertCardLinkIsPresentInSection("MenB", "/vaccines/menb-vaccine-for-children", AgeSectionTestId.CHILDREN);
    assertCardLinkIsPresentInSection("Pneumococcal", "/vaccines/pneumococcal-vaccine", AgeSectionTestId.CHILDREN);

    assertCardLinkIsPresentInSection("6-in-1", "/vaccines/6-in-1-vaccine", AgeSectionTestId.BABIES);
    assertCardLinkIsPresentInSection("Rotavirus", "/vaccines/rotavirus-vaccine", AgeSectionTestId.BABIES);
    assertCardLinkIsPresentInSection("Pneumococcal", "/vaccines/pneumococcal-vaccine", AgeSectionTestId.BABIES);
    assertCardLinkIsPresentInSection("MenB", "/vaccines/menb-vaccine-for-children", AgeSectionTestId.BABIES);
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
