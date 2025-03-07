import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Schedule from "./page";
import getContent from "@src/services/contentService";

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
    const expectedCardTitles = ["6-in-1 vaccine"];

    const SchedulePage = await Schedule();
    render(SchedulePage);

    expectedCardTitles.forEach((cardTitle) => {
      const card = screen.getByText(cardTitle);

      expect(card).toBeInTheDocument();
    });
  });
});
