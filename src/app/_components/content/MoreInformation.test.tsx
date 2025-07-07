import { VaccineTypes } from "@src/models/vaccine";
import React from "react";
import { render, screen } from "@testing-library/react";

import { MoreInformation } from "@src/app/_components/content/MoreInformation";
import { mockStyledContent } from "@test-data/content-api/data";

it("should include 'how to get' section for RSV ", async () => {
  const vaccineType = VaccineTypes.RSV;
  render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

  const heading: HTMLElement = screen.getByText("How to get the vaccine");

  expect(heading).toBeInTheDocument();
});

it("should not include 'how to get' section for RSV_PREGNANCY ", async () => {
  const vaccineType = VaccineTypes.RSV_PREGNANCY;
  render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

  const heading: HTMLElement | null = screen.queryByText("How to get the vaccine");

  expect(heading).not.toBeInTheDocument();
});
