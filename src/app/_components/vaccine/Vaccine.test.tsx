import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { StyledVaccineContent } from "@src/services/content-api/parsers/content-styling-service";
import {
  mockStyledContent,
  mockStyledContentWithoutWhatSection,
} from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import { act } from "react";

jest.mock("@src/services/content-api/gateway/content-reader-service");

describe("Any vaccine page", () => {
  const mockVaccineName = "Test-Name";
  let contentPromise: Promise<StyledVaccineContent>;

  const renderVaccinePage = async () => {
    await act(async () => {
      render(
        <VaccineContentProvider contentPromise={contentPromise}>
          <Vaccine name={mockVaccineName} />
        </VaccineContentProvider>,
      );
    });
  };

  describe("with all sections available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(mockStyledContent);
      contentPromise = getContentForVaccine(VaccineTypes.SIX_IN_ONE);
    });

    it("should display correct vaccine name in heading", async () => {
      await renderVaccinePage();

      const heading = screen.getByRole("heading", {
        level: 1,
        name: `${mockVaccineName} vaccine`,
      });

      expect(heading).toBeInTheDocument();
    });

    it("should display overview text", async () => {
      await renderVaccinePage();
      const overviewBlock = screen.getByText("Overview text");
      expect(overviewBlock).toBeInTheDocument();
    });

    it("should display whatItIsFor expander block", async () => {
      await renderVaccinePage();

      const heading = screen.getByText("what-heading");
      const content = screen.getByText("What Section styled component");

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should display whoVaccineIsFor expander block", async () => {
      await renderVaccinePage();

      const heading = screen.getByText("who-heading");
      const content = screen.getByRole("heading", {
        level: 2,
        name: "Who Section styled component",
      });

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should display howToGetVaccine expander block", async () => {
      await renderVaccinePage();

      const heading = screen.getByText("how-heading");
      const content = screen.getByText("How Section styled component");

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should display webpage link", async () => {
      await renderVaccinePage();

      const webpageLink = screen.getByRole("link", {
        name: `Learn more about the ${mockVaccineName} vaccination on nhs.uk`,
      });

      expect(webpageLink).toBeInTheDocument();
      expect(webpageLink).toHaveAttribute("href", "https://www.test.com/");
    });
  });

  describe("without whatItIsFor section", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(
        mockStyledContentWithoutWhatSection,
      );
      contentPromise = getContentForVaccine(VaccineTypes.SIX_IN_ONE);
    });

    it("should not display whatItIsFor section", async () => {
      await renderVaccinePage();

      const heading: HTMLElement | null = screen.queryByText("what-heading");
      const content: HTMLElement | null = screen.queryByText(
        "What Section styled component",
      );

      expect(heading).not.toBeInTheDocument();
      expect(content).not.toBeInTheDocument();
    });

    it("should display whoVaccineIsFor section", async () => {
      await renderVaccinePage();

      const heading: HTMLElement = screen.getByText("who-heading");
      const content: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Who Section styled component",
      });

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });
});
