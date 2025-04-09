import { render, screen } from "@testing-library/react";
import Schedule from "./page";
import { JSX } from "react";

jest.mock("@src/services/content-api/gateway/content-reader-service");

describe("Schedule Page", () => {
  beforeEach(() => {
    const SchedulePage: JSX.Element = Schedule();
    render(SchedulePage);
  });

  it("renders the correct page heading", async () => {
    const heading: HTMLElement = screen.getByRole("heading", {
      level: 1,
      name: "Vaccination schedule",
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders the section headings", async () => {
    const expectedSectionText: string[] = [
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

  it("renders static description text", async () => {
    const description: HTMLElement = screen.getByText(
      "Find out about vaccinations for babies, children and adults, including why they're important and how to get them.",
    );

    expect(description).toBeInTheDocument();
  });

  it("renders card component with props", async () => {
    const expectedVaccines = [
      {
        name: "6-in-1 vaccine",
        href: "/vaccines/6-in-1",
      },
    ];

    expectedVaccines.forEach((vaccine) => {
      const card: HTMLElement = screen.getByText(vaccine.name);

      expect(card).toBeInTheDocument();
      expect(card.getAttribute("href")).toBe(vaccine.href);
    });
  });

  it("should contain back link to vaccination hub page", async () => {
    const pathToHubPage: string = "/";

    const linkToHubPage: HTMLElement = screen.getByRole("link", {
      name: "Go back",
    });

    expect(linkToHubPage.getAttribute("href")).toBe(pathToHubPage);
  });
});
