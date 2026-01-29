import Callout from "@src/app/_components/nhs-frontend/WarningCallout";
import { VaccineType } from "@src/models/vaccine";
import { mockStyledContent } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Callout component", () => {
  it("renders correctly", () => {
    const vaccineType = VaccineType.MMR;

    render(<Callout styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const calloutHeading: HTMLElement = screen.getByRole("heading", { name: "Important: Callout Heading" });

    expect(calloutHeading).toBeInTheDocument();
  });

  it("does not render for vaccines for which they should not be shown", () => {
    const vaccineType = VaccineType.SHINGLES;

    render(<Callout styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const calloutHeading: HTMLElement | null = screen.queryByRole("heading", { name: "Important: Callout Heading" });

    expect(calloutHeading).not.toBeInTheDocument();
  });
});
