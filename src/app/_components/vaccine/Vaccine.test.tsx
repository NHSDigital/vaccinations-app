import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { ContentErrorTypes } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { mockStyledContent, mockStyledContentWithoutWhatSection } from "@test-data/content-api/data";
import { render, screen, within } from "@testing-library/react";
import { EligibilityErrorTypes, EligibilityStatus } from "@src/services/eligibility-api/types";
import { eligibilityContentBuilder } from "@test-data/eligibility-api/builders";
import { auth } from "@project/auth";
import React from "react";
import { RSVEligibilityFallback } from "@src/app/_components/eligibility/RSVEligibilityFallback";

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

  describe("with all sections available", () => {
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

      const moreInformationExpanders = screen.getByTestId("more-information-expander-group");
      const howSectionWithinExpander = within(moreInformationExpanders).queryByText("How to get the vaccine");
      expect(howSectionWithinExpander).not.toBeInTheDocument();
    });

    it("should display whatItIsFor expander block", async () => {
      await renderRsvVaccinePage();

      const heading: HTMLElement = screen.getByText("What this vaccine is for");
      const content: HTMLElement = screen.getByText("What Section styled component");

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should display whoVaccineIsFor expander block", async () => {
      await renderRsvVaccinePage();

      const heading: HTMLElement = screen.getByText("Who should have this vaccine");
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
      const content: HTMLElement = screen.getByText("How Section styled component");

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("should display webpage link to more information about vaccine", async () => {
      await renderRsvVaccinePage();

      const webpageLink: HTMLElement = screen.getByRole("link", {
        name: "Find out more about the RSV vaccine",
      });

      expect(webpageLink).toBeInTheDocument();
      expect(webpageLink).toHaveAttribute("href", "https://test.example.com/");
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

      const heading: HTMLElement | null = screen.queryByText("What this vaccine is for");
      const content: HTMLElement | null = screen.queryByText("What Section styled component");

      expect(heading).not.toBeInTheDocument();
      expect(content).not.toBeInTheDocument();
    });

    it("should display whoVaccineIsFor section", async () => {
      await renderRsvVaccinePage();

      const heading: HTMLElement = screen.getByText("Who should have this vaccine");
      const content: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Who Section styled component",
      });

      expect(heading).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });

  describe("when content load fails", () => {
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

      const expanderHeading1: HTMLElement | null = screen.queryByText("What this vaccine is for");
      const expanderHeading2: HTMLElement | null = screen.queryByText("Who should have this vaccine");
      const expanderHeading3: HTMLElement | null = screen.queryByText("how-heading");

      expect(expanderHeading1).not.toBeInTheDocument();
      expect(expanderHeading2).not.toBeInTheDocument();
      expect(expanderHeading3).not.toBeInTheDocument();
    });

    it("should display vaccine info expanders", async () => {
      await renderRsvVaccinePage();

      const expanderHeading1: HTMLElement | null = screen.queryByText("What this vaccine is for");
      const expanderHeading2: HTMLElement | null = screen.queryByText("Who should have this vaccine");
      const expanderHeading3: HTMLElement | null = screen.queryByText("how-heading");

      expect(expanderHeading1).not.toBeInTheDocument();
      expect(expanderHeading2).not.toBeInTheDocument();
      expect(expanderHeading3).not.toBeInTheDocument();
    });

    it("should display fallback webpage link to more information about vaccine", async () => {
      await renderRsvVaccinePage();

      const fallbackLink: HTMLElement = screen.getByRole("link", {
        name: "Find out more about the RSV vaccine",
      });

      expect(fallbackLink).toBeInTheDocument();
      expect(fallbackLink).toHaveAttribute("href", "https://www.nhs.uk/vaccinations/rsv-vaccine/");
      expect(fallbackLink).toHaveAttribute("target", "_blank");
    });

    it("should still render eligibility section of vaccine page", async () => {
      await renderRsvVaccinePage();

      const eligibilitySection: HTMLElement = screen.getByText("Test Eligibility Component");
      expect(eligibilitySection).toBeInTheDocument();
    });

    it("should display fallback how-to-get link on rsv pregnancy page", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      const fallbackHowToGetLink: HTMLElement = screen.getByRole("link", { name: "how to get" });

      expect(fallbackHowToGetLink).toBeInTheDocument();
      expect(fallbackHowToGetLink).toHaveAttribute(
        "href",
        "https://www.nhs.uk/vaccinations/rsv-vaccine/#how-to-get-it",
      );
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

  describe("eligibility section", () => {
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

  describe("eligibility failures", () => {
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

      // TODO VIA-331: assert that the fallback content is passed in for howToGet
      expect(RSVEligibilityFallback).toHaveBeenCalledWith(
        {
          howToGetVaccineFallback: mockStyledContent.howToGetVaccine.component,
          vaccineType,
        },
        undefined,
      );
    });
  });

  describe("eligibility AND content failures", () => {
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

    // TODO: VIA-331 review placement of logic to generate different how to get link
    it("should use fallback how-to-get text when rendering eligibility fallback component", async () => {
      const vaccineType = VaccineTypes.RSV;

      const expectedHowToGetWhenContentIsDown: React.JSX.Element = (
        <p>
          Find out <a href={VaccineInfo[vaccineType].nhsHowToGetWebpageLink.href}>how to get</a> an {VaccineInfo[vaccineType].displayName.midSentenceCase}{" "}
          vaccination
        </p>
      );

      await renderNamedVaccinePage(vaccineType);

      const rsvELigibilityFallback: HTMLElement = screen.getByTestId("elid-fallback-mock");
      expect(rsvELigibilityFallback).toBeVisible();

      expect(RSVEligibilityFallback).toHaveBeenCalledWith(
        {
          howToGetVaccineFallback: expectedHowToGetWhenContentIsDown,
          vaccineType,
        },
        undefined,
      );
      //
      //  TODO VIA-331 review placement of logic to generate different how to get link
      // const fallbackHowToGetLink: HTMLElement = within(rsvEligibilityFallback).getByRole("link", { name: "how to get" });
      //   expect(fallbackHeading).toBeVisible();
      // expect(fallbackHowToGetLink).toBeInTheDocument();
      // expect(fallbackHowToGetLink).toHaveAttribute(
      //   "href",
      //   "https://www.nhs.uk/vaccinations/rsv-vaccine/#how-to-get-it"
      // );
    });
  });
});
