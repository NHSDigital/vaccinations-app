import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Schedule from "./page";

jest.mock("@src/services/content-api/contentService");

describe("Schedule Page", () => {
  it("renders the correct page heading", async () => {
    const SchedulePage = Schedule();
    render(SchedulePage);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Vaccination schedule",
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders the section headings", async () => {
    const expectedSectionText = ["Vaccines for babies under 1 year old"];

    const SchedulePage = Schedule();
    render(SchedulePage);

    expectedSectionText.forEach((headingText) => {
      const sectionHeading = screen.getByRole("heading", {
        level: 2,
        name: headingText,
      });

      expect(sectionHeading).toBeInTheDocument();
    });
  });

  it("renders static description text", async () => {
    const SchedulePage = Schedule();
    render(SchedulePage);

    const description = screen.getByText(
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

    const SchedulePage = Schedule();
    render(SchedulePage);

    expectedVaccines.forEach((vaccine) => {
      const card = screen.getByText(vaccine.name);

      expect(card).toBeInTheDocument();
      expect(card.getAttribute("href")).toBe(vaccine.href);
    });
  });

  it("should contain back link to vaccination hub page", async () => {
    const pathToHubPage = "/";

    const schedulePage = Schedule();
    render(schedulePage);

    const linkToHubPage = screen.getByRole("link", { name: "Go back" });

    expect(linkToHubPage.getAttribute("href")).toBe(pathToHubPage);
  });
});
