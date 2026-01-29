import { Overview } from "@src/app/_components/content/Overview";
import { VaccineType } from "@src/models/vaccine";
import {
  mockStyledContent,
  mockStyledContentWithHtmlOverview,
  mockStyledContentWithMissingOverview,
} from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("cheerio", () => ({
  load: jest.fn(() => {
    const selectorImpl = jest.fn(() => ({
      attr: jest.fn(),
    }));

    const $ = Object.assign(selectorImpl, {
      html: jest.fn(() => "Overview <b>text</b>"),
    });

    return $;
  }),
}));

describe("Overview component", () => {
  it("renders overview without HTML correctly", () => {
    const vaccineType = VaccineType.SHINGLES;

    render(<Overview overview={mockStyledContent.overview} vaccineType={vaccineType} />);

    const overviewText: HTMLElement = screen.getByText("Overview text");

    expect(overviewText).toBeInTheDocument();
  });

  it("renders overview with HTML correctly", () => {
    const vaccineType = VaccineType.SHINGLES;

    render(<Overview overview={mockStyledContentWithHtmlOverview.overview} vaccineType={vaccineType} />);

    const overviewText: HTMLElement = screen.getByText("Overview");

    expect(overviewText).toBeInTheDocument();

    const boldElement = screen.getByText("text");

    expect(overviewText).toContainElement(boldElement);
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe("B");
  });

  it("does not render missing overview", () => {
    const vaccineType = VaccineType.FLU_IN_PREGNANCY;

    render(<Overview overview={mockStyledContentWithMissingOverview.overview} vaccineType={vaccineType} />);

    const overviewText: HTMLElement | null = screen.queryByText("Overview text");

    expect(overviewText).not.toBeInTheDocument();
  });
});
