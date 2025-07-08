import { auth } from "@project/auth";
import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { RSVEligibilityFallback } from "@src/app/_components/eligibility/RSVEligibilityFallback";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { ContentErrorTypes } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { EligibilityErrorTypes, EligibilityStatus } from "@src/services/eligibility-api/types";
import { mockStyledContent } from "@test-data/content-api/data";
import { eligibilityContentBuilder } from "@test-data/eligibility-api/builders";
import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("@src/services/content-api/gateway/content-reader-service", () => ({
  getContentForVaccine: jest.fn(),
}));
jest.mock("@src/services/eligibility-api/domain/eligibility-filter-service", () => ({
  getEligibilityForPerson: jest.fn(),
}));
jest.mock("@src/app/_components/eligibility/Eligibility", () => ({
  Eligibility: () => <div>Test Eligibility Component</div>,
}));
jest.mock("@src/app/_components/nbs/NBSBookingAction", () => ({
  NBSBookingAction: () => <a href="https://nbs-test-link">NBS Booking Link Test</a>,
}));
jest.mock("@src/app/_components/eligibility/RSVEligibilityFallback", () => ({
  RSVEligibilityFallback: jest.fn().mockImplementation(() => <div data-testid="elid-fallback-mock">EliD fallback</div>),
}));
jest.mock("@src/app/_components/content/MoreInformation", () => ({
  MoreInformation: jest.fn().mockImplementation(() => <div data-testid="more-information-mock">More Information</div>),
}));
jest.mock("@src/app/_components/content/FindOutMore", () => ({
  FindOutMoreLink: jest.fn().mockImplementation(() => <div data-testid="find-out-more-link-mock">Find Out More</div>),
}));
jest.mock("@src/app/_components/content/HowToGetVaccineFallback", () => ({
  HowToGetVaccineFallback: jest
    .fn()
    .mockImplementation(() => <div data-testid="how-to-get-content-fallback-mock">How to get content fallback</div>),
}));
jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));

const nhsNumber = "5123456789";

describe("Any vaccine page", () => {
  const renderNamedVaccinePage = async (vaccineType: VaccineTypes) => {
    render(await Vaccine({ vaccineType: vaccineType }));
  };

  const renderRsvVaccinePage = async () => {
    await renderNamedVaccinePage(VaccineTypes.RSV);
  };

  describe("shows content section, when content available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibility: {
          status: EligibilityStatus.NOT_ELIGIBLE,
          content: undefined,
        },
      });
      (auth as jest.Mock).mockResolvedValue({
        user: {
          nhs_number: nhsNumber,
          birthdate: new Date(),
        },
      });
    });

    it("should display overview inset text if defined for vaccine", async () => {
      const expectedInsetText: string | undefined = VaccineInfo[VaccineTypes.RSV].overviewInsetText;

      await renderNamedVaccinePage(VaccineTypes.RSV);

      const overviewInsetBlock: HTMLElement = screen.getByTestId("overview-inset-text");
      expect(overviewInsetBlock).toBeInTheDocument();
      expect(overviewInsetBlock.innerHTML).toContain(expectedInsetText);
    });

    it("should display link in overview text if defined for vaccine", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV);

      const rsvPregnancyLink: HTMLElement = screen.getByRole("link", {
        name: "RSV in pregnancy",
      });

      expect(rsvPregnancyLink).toBeInTheDocument();
      expect(rsvPregnancyLink).toHaveAttribute("href", "/vaccines/rsv-pregnancy");
    });

    it("should include lowercase vaccine name in more information text", async () => {
      const expectedMoreInformationHeading: string = "More information about the RSV vaccine";

      await renderRsvVaccinePage();

      const moreInfoHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: expectedMoreInformationHeading,
      });

      expect(moreInfoHeading).toBeInTheDocument();
    });

    it("should display inset text for rsv in pregnancy", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      const recommendedBlock: HTMLElement | undefined = screen.getAllByRole("heading", { level: 3 }).at(0);
      expect(recommendedBlock).toHaveClass("nhsuk-card--care__heading");
      expect(recommendedBlock?.innerHTML).toContain("The RSV vaccine is recommended if you:");
    });

    it("should display how to get text outside of expander in rsv pregnancy page", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      const heading: HTMLElement = screen.getByText("How to get the vaccine");
      const content: HTMLElement = screen.getByText("How Section styled component");

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should not display find out more link", async () => {
      await renderRsvVaccinePage();

      const findOutMore: HTMLElement | null = screen.queryByTestId("find-out-more-link-mock");

      expect(findOutMore).not.toBeInTheDocument();
    });
  });

  describe("shows content section, when content load fails", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibility: {
          status: EligibilityStatus.NOT_ELIGIBLE,
          content: eligibilityContentBuilder().build(),
        },
      });
    });

    it("should not display vaccine info expanders", async () => {
      await renderRsvVaccinePage();

      const moreInfo = screen.queryByTestId("more-information-mock");

      expect(moreInfo).not.toBeInTheDocument();
    });

    it("should display find out more link", async () => {
      await renderRsvVaccinePage();

      const findOutMore: HTMLElement = screen.getByTestId("find-out-more-link-mock");

      expect(findOutMore).toBeInTheDocument();
    });

    it("should still render eligibility section of vaccine page", async () => {
      await renderRsvVaccinePage();

      const eligibilitySection: HTMLElement = screen.getByText("Test Eligibility Component");
      expect(eligibilitySection).toBeInTheDocument();
    });

    it("should display fallback how-to-get link on rsv pregnancy page", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      const fallbackHowToGetLink: HTMLElement = screen.getByTestId("how-to-get-content-fallback-mock");

      expect(fallbackHowToGetLink).toBeInTheDocument();
    });
  });

  describe("booking link placeholder", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibility: {
          status: EligibilityStatus.NOT_ELIGIBLE,
          content: undefined,
        },
      });
    });

    it("should display the booking link button for RSV", async () => {
      await renderRsvVaccinePage();

      const bookingButton: HTMLElement = screen.getByText("NBS Booking Link Test");

      expect(bookingButton).toBeInTheDocument();
    });

    it("should NOT display the booking link button for other vaccines", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      const bookingButton: HTMLElement | null = screen.queryByText("NBS Booking Link Test");

      expect(bookingButton).not.toBeInTheDocument();
    });
  });

  describe("shows eligibility section, when eligibility response available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibility: {
          status: EligibilityStatus.NOT_ELIGIBLE,
          content: eligibilityContentBuilder().build(),
        },
      });
    });

    it("should display the eligibility on RSV vaccine page", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV);

      const eligibilitySection: HTMLElement = screen.getByText("Test Eligibility Component");
      expect(eligibilitySection).toBeInTheDocument();
    });

    it("should not display the eligibility on RSV pregnancy vaccine page", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      const eligibilitySection: HTMLElement | null = screen.queryByText("Test Eligibility Component");
      expect(eligibilitySection).not.toBeInTheDocument();
    });

    it("should not call EliD API on RSV pregnancy vaccine page", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      expect(getEligibilityForPerson).not.toHaveBeenCalled();
    });

    it("should not display the eligibility when there is no content ", async () => {
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibility: {
          status: EligibilityStatus.NOT_ELIGIBLE,
          content: undefined,
        },
      });

      await renderNamedVaccinePage(VaccineTypes.RSV);

      const eligibilitySection: HTMLElement | null = screen.queryByText("Test Eligibility Component");
      expect(eligibilitySection).not.toBeInTheDocument();
    });

    it("should not display the eligibility when there is no session ", async () => {
      (auth as jest.Mock).mockResolvedValue(undefined);

      await renderNamedVaccinePage(VaccineTypes.RSV);

      const eligibilitySection: HTMLElement | null = screen.queryByText("Test Eligibility Component");
      expect(eligibilitySection).not.toBeInTheDocument();
    });
  });

  describe("shows eligibility section, when eligibility response not available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
      });
    });

    it("should display fallback eligibility component using howToGet text from content-api when eligibility API has failed", async () => {
      const vaccineType = VaccineTypes.RSV;
      await renderNamedVaccinePage(vaccineType);

      const rsvELigibilityFallback: HTMLElement = screen.getByTestId("elid-fallback-mock");
      expect(rsvELigibilityFallback).toBeVisible();

      expect(RSVEligibilityFallback).toHaveBeenCalledWith(
        {
          howToGetVaccineFallback: mockStyledContent.howToGetVaccine.component,
          vaccineType,
        },
        undefined,
      );
    });
  });

  describe("shows content and eligibility sections, when eligibility AND content not available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibility: undefined,
        eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
      });
    });

    it("should use fallback how-to-get text when rendering eligibility fallback component", async () => {
      const vaccineType = VaccineTypes.RSV;

      await renderNamedVaccinePage(vaccineType);

      const rsvELigibilityFallback: HTMLElement = screen.getByTestId("elid-fallback-mock");
      expect(rsvELigibilityFallback).toBeVisible();

      expect(RSVEligibilityFallback).toHaveBeenCalledWith(
        {
          howToGetVaccineFallback: <HowToGetVaccineFallback vaccineType={vaccineType} />,
          vaccineType,
        },
        undefined,
      );
    });
  });
});
