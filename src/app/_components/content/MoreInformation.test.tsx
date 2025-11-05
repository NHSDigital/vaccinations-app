import { MoreInformation } from "@src/app/_components/content/MoreInformation";
import { VaccineTypes } from "@src/models/vaccine";
import { mockStyledContent, mockStyledContentWithoutWhatSection } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("MoreInformation component ", () => {
  it("should display whatItIsFor expander block", async () => {
    const vaccineType = VaccineTypes.RSV;
    render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const heading: HTMLElement = screen.getByText("What the vaccine is for");
    const content: HTMLElement = screen.getByText("What Section styled component");

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should display whoVaccineIsFor expander block", async () => {
    const vaccineType = VaccineTypes.RSV;
    render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const heading: HTMLElement = screen.getByText("Who should have the vaccine");
    const content: HTMLElement = screen.getByRole("heading", {
      level: 2,
      name: "Who Section styled component",
    });

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should display vaccineSideEffects expander block", async () => {
    const vaccineType = VaccineTypes.RSV;
    render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const heading: HTMLElement = screen.getByText("Side effects of the vaccine");
    const content: HTMLElement = screen.getByText("Side effects section styled component");

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

    const whatItIsForHeading: HTMLElement | null = screen.queryByText("What the vaccine is for");
    const whatItIsForContent: HTMLElement | null = screen.queryByText("What Section styled component");

    expect(whatItIsForHeading).not.toBeInTheDocument();
    expect(whatItIsForContent).not.toBeInTheDocument();
  });

  it("should display whoVaccineIsFor section even if whatItIsFor is undefined in content", async () => {
    const vaccineType = VaccineTypes.RSV;
    render(<MoreInformation styledVaccineContent={mockStyledContentWithoutWhatSection} vaccineType={vaccineType} />);

    const whoVaccineIsForHeading: HTMLElement = screen.getByText("Who should have the vaccine");
    const whoVaccineIsForContent: HTMLElement = screen.getByRole("heading", {
      level: 2,
      name: "Who Section styled component",
    });

    expect(whoVaccineIsForHeading).toBeInTheDocument();
    expect(whoVaccineIsForContent).toBeInTheDocument();
  });
});
