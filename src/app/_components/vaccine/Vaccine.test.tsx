import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import {
  mockStyledContent,
  mockStyledContentWithoutWhatSection,
} from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import {
  ContentErrorTypes,
  GetContentForVaccineResponse,
} from "@src/services/content-api/types";
import {
  EligibilityStatus,
  GetEligibilityForPersonResponse,
} from "@src/services/eligibility-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-reader-service";
import { mockStyledEligibility } from "@test-data/eligibility-api/data";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/services/eligibility-api/gateway/eligibility-reader-service");

describe("Any vaccine page", () => {
  let contentPromise: Promise<GetContentForVaccineResponse>;
  let eligibilityPromise: Promise<GetEligibilityForPersonResponse>;

  const renderNamedVaccinePage = async (vaccineType: VaccineTypes) => {
    await act(async () => {
      render(
        <VaccineContentProvider
          contentPromise={contentPromise}
          eligibilityPromise={eligibilityPromise}
        >
          <Vaccine vaccineType={vaccineType} />
        </VaccineContentProvider>,
      );
    });
  };

  const renderVaccinePage = async () => {
    await renderNamedVaccinePage(VaccineTypes.PNEUMOCOCCAL);
  };

  describe("with all sections available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        styledEligibilityContent: mockStyledEligibility,
      });
      contentPromise = getContentForVaccine(VaccineTypes.SIX_IN_ONE);
      eligibilityPromise = getEligibilityForPerson(
        "5000000014",
        VaccineTypes.SIX_IN_ONE,
      );
    });

    it("should display correct vaccine name in heading", async () => {
      await renderVaccinePage();

      const heading = screen.getByRole("heading", {
        level: 1,
        name: `Pneumococcal vaccine`,
      });

      expect(heading).toBeInTheDocument();
    });

    it("should display overview text", async () => {
      await renderVaccinePage();
      const overviewBlock: HTMLElement = screen.getByText("Overview text");
      expect(overviewBlock).toBeInTheDocument();
    });

    it("should display overview inset text if defined for vaccine", async () => {
      const expectedInsetText = VaccineInfo[VaccineTypes.FLU].overviewInsetText;

      await renderNamedVaccinePage(VaccineTypes.FLU);

      const overviewInsetBlock = screen.getByTestId("overview-inset-text");
      expect(overviewInsetBlock).toBeInTheDocument();
      expect(overviewInsetBlock.innerHTML).toContain(expectedInsetText);
    });

    it("should display child's flu link in overview text", async () => {
      await renderNamedVaccinePage(VaccineTypes.FLU);

      const childFluLink: HTMLElement = screen.getByRole("link", {
        name: "children's flu vaccine",
      });

      expect(childFluLink).toBeInTheDocument();
      expect(childFluLink).toHaveAttribute("href", "/vaccines/child-flu");
    });

    it("should display pregnancy's flu link in overview text", async () => {
      await renderNamedVaccinePage(VaccineTypes.FLU);

      const pregnancyFluLink: HTMLElement = screen.getByRole("link", {
        name: "flu jab in pregnancy",
      });

      expect(pregnancyFluLink).toBeInTheDocument();
      expect(pregnancyFluLink).toHaveAttribute("href", "/vaccines/flu-jab");
    });

    it("should not display overview inset text if not defined for vaccine", async () => {
      await renderNamedVaccinePage(VaccineTypes.SIX_IN_ONE);

      const overviewInsetBlock = screen.queryByTestId("overview-inset-text");
      expect(overviewInsetBlock).not.toBeInTheDocument();
    });

    it("should include lowercase vaccine name in more infomation text", async () => {
      const expectedMoreInformationHeading =
        "More information about the pneumococcal vaccine";

      await renderVaccinePage();

      const moreInfoHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: expectedMoreInformationHeading,
      });

      expect(moreInfoHeading).toBeInTheDocument();
    });

    it("should display whatItIsFor expander block", async () => {
      await renderVaccinePage();

      const heading: HTMLElement = screen.getByText("What this vaccine is for");
      const content: HTMLElement = screen.getByText(
        "What Section styled component",
      );

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should display whoVaccineIsFor expander block", async () => {
      await renderVaccinePage();

      const heading: HTMLElement = screen.getByText(
        "Who should have this vaccine",
      );
      const content: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Who Section styled component",
      });

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should display howToGetVaccine expander block", async () => {
      await renderVaccinePage();

      const heading: HTMLElement = screen.getByText("How to get the vaccine");
      const content: HTMLElement = screen.getByText(
        "How Section styled component",
      );

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should display webpage link to more information about vaccine", async () => {
      await renderVaccinePage();

      const webpageLink: HTMLElement = screen.getByRole("link", {
        name: "Find out more about the pneumococcal vaccination",
      });

      expect(webpageLink).toBeInTheDocument();
      expect(webpageLink).toHaveAttribute("href", "https://www.test.com/");
      expect(webpageLink).toHaveAttribute("target", "_blank");
    });
  });

  describe("without whatItIsFor section", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContentWithoutWhatSection,
      });
      contentPromise = getContentForVaccine(VaccineTypes.SIX_IN_ONE);
    });

    it("should not display whatItIsFor section", async () => {
      await renderVaccinePage();

      const heading: HTMLElement | null = screen.queryByText(
        "What this vaccine is for",
      );
      const content: HTMLElement | null = screen.queryByText(
        "What Section styled component",
      );

      expect(heading).not.toBeInTheDocument();
      expect(content).not.toBeInTheDocument();
    });

    it("should display whoVaccineIsFor section", async () => {
      await renderVaccinePage();

      const heading: HTMLElement = screen.getByText(
        "Who should have this vaccine",
      );
      const content: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Who Section styled component",
      });

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });

  describe("when eligible", () => {
    beforeEach(() => {
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibilityStatus: EligibilityStatus.ELIGIBLE_BOOKABLE,
        styledEligibilityContent: mockStyledEligibility,
      });
      eligibilityPromise = getEligibilityForPerson(
        "5123456789",
        VaccineTypes.RSV,
      );
    });

    it("should not show the care card", async () => {
      await renderVaccinePage();

      const careCard = screen.queryByTestId("non-urgent-care-card");
      expect(careCard).toBeNull();
    });
  });

  describe("when not eligible", () => {
    beforeEach(() => {
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
        styledEligibilityContent: mockStyledEligibility,
      });
      eligibilityPromise = getEligibilityForPerson(
        "5123456789",
        VaccineTypes.RSV,
      );
    });

    it("should show the care card", async () => {
      await renderVaccinePage();

      const careCard = screen.getByTestId("non-urgent-care-card");
      expect(careCard).toBeInTheDocument();
    });
  });

  describe("when content load fails", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      });
      contentPromise = getContentForVaccine(VaccineTypes.SIX_IN_ONE);
    });

    it("should still display heading with correct vaccine name", async () => {
      await renderVaccinePage();

      const heading = screen.getByRole("heading", {
        level: 1,
        name: `Pneumococcal vaccine`,
      });

      expect(heading).toBeInTheDocument();
    });

    it("should display error summary", async () => {
      await renderVaccinePage();

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(errorHeading).toBeInTheDocument();
    });

    it("should not render any other areas of the vaccine page", async () => {
      await renderVaccinePage();

      const overviewBlock: HTMLElement | null =
        screen.queryByText("Overview text");
      expect(overviewBlock).not.toBeInTheDocument();

      const howToGetHeading: HTMLElement | null =
        screen.queryByText("how-heading");
      const howToGetContent: HTMLElement | null = screen.queryByText(
        "How Section styled component",
      );

      expect(howToGetHeading).not.toBeInTheDocument();
      expect(howToGetContent).not.toBeInTheDocument();
    });
  });
});
