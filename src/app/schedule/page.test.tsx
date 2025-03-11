import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Schedule from "./page";
import { getContent } from "@src/services/contentService";

jest.mock("@src/services/contentService");

describe("Schedule Page", () => {
  const mockDescription = "mock description";

  beforeEach(() => {
    const mockContent = {
      description: mockDescription,
    };
    (getContent as jest.Mock).mockResolvedValue(mockContent);
  });

  it("renders the correct page heading", async () => {
    const SchedulePage = await Schedule();
    render(SchedulePage);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Vaccination schedule",
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders the section headings", async () => {
    const expectedSectionText = ["Vaccines for babies under 1 year old"];

    const SchedulePage = await Schedule();
    render(SchedulePage);

    expectedSectionText.forEach((headingText) => {
      const sectionHeading = screen.getByRole("heading", {
        level: 2,
        name: headingText,
      });

      expect(sectionHeading).toBeInTheDocument();
    });
  });

  it("renders description text from the content API", async () => {
    const SchedulePage = await Schedule();
    render(SchedulePage);

    const description = screen.getByText(mockDescription);

    expect(description).toBeInTheDocument();
  });

  it("renders card component with props", async () => {
    const expectedVaccines = [
      {
        name: "6-in-1 vaccine",
        href: "/vaccines/6-in-1",
      },
    ];

    const SchedulePage = await Schedule();
    render(SchedulePage);

    expectedVaccines.forEach((vaccine) => {
      const card = screen.getByText(vaccine.name);

      expect(card).toBeInTheDocument();
      expect(card.getAttribute("href")).toBe(vaccine.href);
    });
  });
});
