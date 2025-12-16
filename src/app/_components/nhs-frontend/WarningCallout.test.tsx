import Callout from "@src/app/_components/nhs-frontend/WarningCallout";
import { VaccineType } from "@src/models/vaccine";
import { mockStyledContent } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Callout component", () => {
  it("renders correctly", () => {
    const vaccineType = VaccineType.MMR;

    render(<Callout styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const CalloutText: HTMLElement = screen.getByTestId("callout");

    expect(CalloutText).toBeInTheDocument();
  });

  it("does not render for vaccines for which they should not be shown", () => {
    const vaccineType = VaccineType.SHINGLES;

    render(<Callout styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const CalloutText: HTMLElement | null = screen.queryByTestId("Callout-text");

    expect(CalloutText).not.toBeInTheDocument();
  });
});
