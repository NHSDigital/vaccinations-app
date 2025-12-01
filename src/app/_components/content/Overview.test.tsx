import { Overview } from "@src/app/_components/content/Overview";
import { VaccineType } from "@src/models/vaccine";
import {
  mockStyledContent,
  mockStyledContentWithHtmlOverview,
  mockStyledContentWithMissingOverview,
} from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Overview component", () => {
  it("renders overview without HTML correctly", () => {
    const vaccineType = VaccineType.SHINGLES;

    render(<Overview styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const overviewText: HTMLElement = screen.getByTestId("overview-text");

    expect(overviewText).toBeInTheDocument();
  });

  it("renders overview with HTML correctly", () => {
    const vaccineType = VaccineType.SHINGLES;

    render(<Overview styledVaccineContent={mockStyledContentWithHtmlOverview} vaccineType={vaccineType} />);

    const overviewText: HTMLElement = screen.getByTestId("overview-text");

    expect(overviewText).toBeInTheDocument();

    const boldElement = screen.getByText("text");

    expect(overviewText).toContainElement(boldElement);
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe("B");
  });

  it("does not render missing overview", () => {
    const vaccineType = VaccineType.FLU_IN_PREGNANCY;

    render(<Overview styledVaccineContent={mockStyledContentWithMissingOverview} vaccineType={vaccineType} />);

    const overviewText: HTMLElement | null = screen.queryByTestId("overview-text");

    expect(overviewText).not.toBeInTheDocument();
  });
});
