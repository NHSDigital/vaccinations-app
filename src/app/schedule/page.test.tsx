import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Schedule from "./page";

describe("Schedule Page", () => {
  it("renders the correct page heading", () => {
    render(<Schedule />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Vaccination schedule",
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders the section headings", () => {
    render(<Schedule />);
    const expectedSectionText = ["Vaccines for babies under 1 year old"];

    expectedSectionText.forEach((headingText) => {
      const sectionHeading = screen.getByRole("heading", {
        level: 2,
        name: headingText,
      });

      expect(sectionHeading).toBeInTheDocument();
    });
  });
});
