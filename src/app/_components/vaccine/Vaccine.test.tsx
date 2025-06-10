import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import {
  mockStyledContent,
  mockStyledContentWithoutWhatSection,
} from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import { ContentErrorTypes } from "@src/services/content-api/types";
import { EligibilityStatus } from "@src/services/eligibility-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-filter-service";
import { mockStyledEligibility } from "@test-data/eligibility-api/data";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/services/eligibility-api/gateway/eligibility-filter-service");
jest.mock("@src/app/_components/nbs/NBSBookingButton", () => ({
  NBSBookingButton: () => <div>NBS Booking Link Test</div>,
}));

describe("Any vaccine page", () => {
  const renderNamedVaccinePage = async (vaccineType: VaccineTypes) => {
    render(await Vaccine({ vaccineType: vaccineType }));
  };

  const renderRsvVaccinePage = async () => {
    await renderNamedVaccinePage(VaccineTypes.RSV);
  };

  describe("with all sections available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        styledEligibilityContent: mockStyledEligibility,
      });
    });

    it("should display correct vaccine name in heading", async () => {
      await renderRsvVaccinePage();

      const heading = screen.getByRole("heading", {
        level: 1,
        name: `RSV vaccine for older adults`,
      });

      expect(heading).toBeInTheDocument();
    });

    it("should display overview text", async () => {
      await renderRsvVaccinePage();
      const overviewBlock: HTMLElement = screen.getByText("Overview text");
      expect(overviewBlock).toBeInTheDocument();
    });

    it("should display overview inset text if defined for vaccine", async () => {
      const expectedInsetText = VaccineInfo[VaccineTypes.RSV].overviewInsetText;

      await renderNamedVaccinePage(VaccineTypes.RSV);

      const overviewInsetBlock = screen.getByTestId("overview-inset-text");
      expect(overviewInsetBlock).toBeInTheDocument();
      expect(overviewInsetBlock.innerHTML).toContain(expectedInsetText);
    });

    it("should display link in overview text if defined for vaccine", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV);

      const rsvPregnancyLink: HTMLElement = screen.getByRole("link", {
        name: "RSV in pregnancy",
      });

      expect(rsvPregnancyLink).toBeInTheDocument();
      expect(rsvPregnancyLink).toHaveAttribute(
        "href",
        "/vaccines/rsv-pregnancy",
      );
    });

    it("should include lowercase vaccine name in more information text", async () => {
      const expectedMoreInformationHeading =
        "More information about the RSV vaccine";

      await renderRsvVaccinePage();

      const moreInfoHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: expectedMoreInformationHeading,
      });

      expect(moreInfoHeading).toBeInTheDocument();
    });

    it("should display whatItIsFor expander block", async () => {
      await renderRsvVaccinePage();

      const heading: HTMLElement = screen.getByText("What this vaccine is for");
      const content: HTMLElement = screen.getByText(
        "What Section styled component",
      );

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should display whoVaccineIsFor expander block", async () => {
      await renderRsvVaccinePage();

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
      await renderRsvVaccinePage();

      const heading: HTMLElement = screen.getByText("How to get the vaccine");
      const content: HTMLElement = screen.getByText(
        "How Section styled component",
      );

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should display webpage link to more information about vaccine", async () => {
      await renderRsvVaccinePage();

      const webpageLink: HTMLElement = screen.getByRole("link", {
        name: "Find out more about the RSV vaccination",
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
    });

    it("should not display whatItIsFor section", async () => {
      await renderRsvVaccinePage();

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
      await renderRsvVaccinePage();

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
    });

    it("should not show the care card", async () => {
      await renderRsvVaccinePage();

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
    });

    it("should show the care card", async () => {
      await renderRsvVaccinePage();

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
    });

    it("should still display heading with correct vaccine name", async () => {
      await renderRsvVaccinePage();

      const heading = screen.getByRole("heading", {
        level: 1,
        name: `RSV vaccine`,
      });

      expect(heading).toBeInTheDocument();
    });

    it("should display error summary", async () => {
      await renderRsvVaccinePage();

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(errorHeading).toBeInTheDocument();
    });

    it("should not render any other areas of the vaccine page", async () => {
      await renderRsvVaccinePage();

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

  describe("booking link placeholder", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        styledEligibilityContent: mockStyledEligibility,
      });
    });

    it("should display the booking link button for RSV", async () => {
      await renderRsvVaccinePage();

      const bookingButton = screen.getByText("NBS Booking Link Test");

      expect(bookingButton).toBeInTheDocument();
    });

    it("should NOT display the booking link button for other vaccines", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      const bookingButton = screen.queryByText("NBS Booking Link Test");

      expect(bookingButton).not.toBeInTheDocument();
    });
  });
});
