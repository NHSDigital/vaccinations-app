import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { VaccineTypes } from "@src/models/vaccine";
import {
  getStyledContentForVaccine,
  StyledVaccineContent,
} from "@src/services/content-api/contentStylingService";
import { VaccineContentProvider } from "@src/app/_components/providers/vaccine-content-provider";
import { act } from "react";
import { mockStyledContent } from "@test-data/content-api/data";

jest.mock("@src/services/content-api/contentStylingService.tsx");

describe("Any vaccine page", () => {
  const mockVaccineName = "Test-Name";
  let contentPromise: Promise<StyledVaccineContent>;

  beforeEach(() => {
    (getStyledContentForVaccine as jest.Mock).mockResolvedValue(
      mockStyledContent,
    );
    contentPromise = getStyledContentForVaccine(VaccineTypes.SIX_IN_ONE);
  });

  const renderVaccinePage = async () => {
    await act(async () => {
      render(
        <VaccineContentProvider contentPromise={contentPromise}>
          <Vaccine name={mockVaccineName} />
        </VaccineContentProvider>,
      );
    });
  };

  it("should contain correct vaccine name in heading", async () => {
    await renderVaccinePage();

    const heading = screen.getByRole("heading", {
      level: 1,
      name: `${mockVaccineName} vaccine`,
    });

    expect(heading).toBeInTheDocument();
  });

  it("should contain overview text", async () => {
    await renderVaccinePage();
    const overviewBlock = screen.getByText("Overview text");
    expect(overviewBlock).toBeInTheDocument();
  });

  it("should contain whatItIsFor expander block", async () => {
    await renderVaccinePage();

    const heading = screen.getByText("what-heading");
    const content = screen.getByText("What Section styled component");

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should contain whoVaccineIsFor expander block", async () => {
    await renderVaccinePage();

    const heading = screen.getByText("who-heading");
    const content = screen.getByRole("heading", {
      level: 2,
      name: "Who Section styled component",
    });

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should contain howToGetVaccine expander block", async () => {
    await renderVaccinePage();

    const heading = screen.getByText("how-heading");
    const content = screen.getByText("How Section styled component");

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should contain webpage link", async () => {
    await renderVaccinePage();

    const webpageLink = screen.getByRole("link", {
      name: `Find out more about ${mockVaccineName} vaccination on the NHS.uk`,
    });

    expect(webpageLink).toBeInTheDocument();
    expect(webpageLink).toHaveAttribute("href", "https://www.test.com/");
  });
});
