import { VaccineTypes } from "@src/models/vaccine";
import React from "react";
import { render, screen } from "@testing-library/react";

import { MoreInformation } from "@src/app/_components/content/MoreInformation";
import { mockStyledContent, mockStyledContentWithoutWhatSection } from "@test-data/content-api/data";

describe("MoreInformation component ", () => {
  it("should display whatItIsFor expander block", async () => {
    const vaccineType = VaccineTypes.RSV;
    render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const heading: HTMLElement = screen.getByText("What this vaccine is for");
    const content: HTMLElement = screen.getByText("What Section styled component");

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should display whoVaccineIsFor expander block", async () => {
    const vaccineType = VaccineTypes.RSV;
    render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const heading: HTMLElement = screen.getByText("Who should have this vaccine");
    const content: HTMLElement = screen.getByRole("heading", {
      level: 2,
      name: "Who Section styled component",
    });

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should display howToGetVaccine expander block for RSV", async () => {
    const vaccineType = VaccineTypes.RSV;
    render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const heading: HTMLElement = screen.getByText("How to get the vaccine");
    const content: HTMLElement = screen.getByText("How Section styled component");

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should not include 'how to get' section for RSV_PREGNANCY ", async () => {
    const vaccineType = VaccineTypes.RSV_PREGNANCY;
    render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const heading: HTMLElement | null = screen.queryByText("How to get the vaccine");

    expect(heading).not.toBeInTheDocument();
  });

  it("should display webpage link to more information about vaccine", async () => {
    const vaccineType = VaccineTypes.RSV;
    render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const webpageLink: HTMLElement = screen.getByRole("link", {
      name: "Find out more about the RSV vaccine",
    });

    expect(webpageLink).toBeInTheDocument();
    expect(webpageLink).toHaveAttribute("href", "https://test.example.com/");
    expect(webpageLink).toHaveAttribute("target", "_blank");
  });

  it("should not display whatItIsFor section if undefined in content", async () => {
    const vaccineType = VaccineTypes.RSV;
    render(<MoreInformation styledVaccineContent={mockStyledContentWithoutWhatSection} vaccineType={vaccineType} />);

    const whatItIsForHeading: HTMLElement | null = screen.queryByText("What this vaccine is for");
    const whatItIsForContent: HTMLElement | null = screen.queryByText("What Section styled component");

    expect(whatItIsForHeading).not.toBeInTheDocument();
    expect(whatItIsForContent).not.toBeInTheDocument();
  });

  it("should display whoVaccineIsFor section even if whatItIsFor is undefined in content", async () => {
    const vaccineType = VaccineTypes.RSV;
    render(<MoreInformation styledVaccineContent={mockStyledContentWithoutWhatSection} vaccineType={vaccineType} />);

    const whoVaccineIsForHeading: HTMLElement = screen.getByText("Who should have this vaccine");
    const whoVaccineIsForContent: HTMLElement = screen.getByRole("heading", {
      level: 2,
      name: "Who Section styled component",
    });

    expect(whoVaccineIsForHeading).toBeInTheDocument();
    expect(whoVaccineIsForContent).toBeInTheDocument();
  });
});
