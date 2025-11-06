import VaccinesForAllAges from "@src/app/vaccines-for-all-ages/page";
import { assertBackLinkIsPresent } from "@test-data/utils/back-link-helpers";
import { render, screen } from "@testing-library/react";

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

    assertCardLinkIsPresent("RSV", "/vaccines/rsv");
    assertCardLinkIsPresent("RSV in pregnancy", "/vaccines/rsv-pregnancy");
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

const assertCardLinkIsPresent = (text: string, link: string) => {
  const rsvLink: HTMLElement = screen.getByRole("link", { name: text });

  expect(rsvLink).toBeVisible();
  expect(rsvLink.getAttribute("href")).toEqual(link);
};
