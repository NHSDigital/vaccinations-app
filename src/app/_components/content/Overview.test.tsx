import { Overview } from "@src/app/_components/content/Overview";
import { VaccineType } from "@src/models/vaccine";
import { mockStyledContent } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Overview component", () => {
  it("renders correctly", () => {
    const vaccineType = VaccineType.SHINGLES;

    render(<Overview styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const overviewText: HTMLElement = screen.getByTestId("overview-text");

    expect(overviewText).toBeInTheDocument();

    const boldElement = screen.getByText("text");

    expect(overviewText).toContainElement(boldElement);
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe("B");
  });
});
