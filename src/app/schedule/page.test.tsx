import { render, screen } from "@testing-library/react";
import Schedule from "./page";
import { JSX } from "react";
import { assertBackLinkIsPresent } from "@test-data/test-helpers-back-link";

jest.mock("@src/app/_components/nhs-frontend/BackLink", () =>
  jest.fn(() => <div data-testid="back-link"></div>),
);
jest.mock("@src/services/content-api/gateway/content-reader-service");

describe("Schedule Page", () => {
  beforeEach(() => {
    const SchedulePage: JSX.Element = Schedule();
    render(SchedulePage);
  });

  it("renders the page heading", async () => {
    const heading: HTMLElement = screen.getByRole("heading", {
      level: 1,
      name: "Vaccines for all ages",
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders description text", async () => {
    const description: HTMLElement = screen.getByText(
      "Find out about vaccinations for babies, children and adults, including why they're important and how to get them.",
    );

    expect(description).toBeInTheDocument();
  });

  it("renders the section headings", async () => {
    const expectedSectionText: string[] = [
      "Seasonal vaccinations",
      "Vaccines for adults",
      "Vaccines for children aged 1 to 15",
      "Vaccines for babies under 1 year old",
    ];

    expectedSectionText.forEach((headingText) => {
      const sectionHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: headingText,
      });

      expect(sectionHeading).toBeInTheDocument();
    });
  });

  it("renders a card with links for each vaccine", async () => {
    const expectedVaccines = [
      {
        name: "6-in-1",
        href: "/vaccines/6-in-1",
      },
      {
        name: "RSV",
        href: "/vaccines/rsv",
      },
      {
        name: "Flu",
        href: "/vaccines/flu",
      },
      {
        name: "Shingles",
        href: "/vaccines/shingles",
      },
      {
        name: "MenACWY",
        href: "/vaccines/menacwy",
      },
      {
        name: "COVID-19",
        href: "/vaccines/covid-19",
      },
    ];

    expectedVaccines.forEach((vaccine) => {
      const card: HTMLElement = screen.getByText(vaccine.name);

      expect(card).toBeInTheDocument();
      expect(card.getAttribute("href")).toBe(vaccine.href);
    });
  });

  it("renders several cards with links for Pneumococcal", async () => {
    const cards: HTMLElement[] = screen.getAllByText("Pneumococcal");

    expect(cards.length).toBe(3);
    expect(cards[0].getAttribute("href")).toBe("/vaccines/pneumococcal");
    expect(cards[1].getAttribute("href")).toBe("/vaccines/pneumococcal");
    expect(cards[2].getAttribute("href")).toBe("/vaccines/pneumococcal");
  });

  it("should contain back link", () => {
    assertBackLinkIsPresent(screen);
  });
});
