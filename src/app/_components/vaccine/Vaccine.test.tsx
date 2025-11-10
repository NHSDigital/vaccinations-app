import { auth } from "@project/auth";
import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { EligibilityVaccinePageContent } from "@src/app/_components/eligibility/EligibilityVaccinePageContent";
import { RSVPregnancyInfo } from "@src/app/_components/vaccine-custom/RSVPregnancyInfo";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { ContentErrorTypes } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { EligibilityErrorTypes, EligibilityStatus } from "@src/services/eligibility-api/types";
import { mockStyledContent } from "@test-data/content-api/data";
import { eligibilityContentBuilder } from "@test-data/eligibility-api/builders";
import { render, screen } from "@testing-library/react";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";
import React from "react";

jest.mock("@src/services/content-api/content-service", () => ({
  getContentForVaccine: jest.fn(),
}));
jest.mock("@src/services/eligibility-api/domain/eligibility-filter-service", () => ({
  getEligibilityForPerson: jest.fn(),
}));
jest.mock("@src/app/_components/eligibility/EligibilityVaccinePageContent", () => ({
  EligibilityVaccinePageContent: jest
    .fn()
    .mockImplementation(() => (
      <div data-testid="eligibility-page-content-mock">Test Eligibility Content Component</div>
    )),
}));
jest.mock("@src/app/_components/vaccine-custom/RSVPregnancyInfo", () => ({
  RSVPregnancyInfo: jest
    .fn()
    .mockImplementation(() => <div data-testid="rsv-pregnancy-mock">Test RSV Pregnancy Component</div>),
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
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const nhsNumber = "5123456789";

describe("Any vaccine page", () => {
  const renderNamedVaccinePage = async (vaccineType: VaccineTypes) => {
    render(await Vaccine({ vaccineType: vaccineType }));
  };

  const renderRsvVaccinePage = async () => {
    await renderNamedVaccinePage(VaccineTypes.RSV);
  };

  beforeEach(() => {
    (auth as jest.Mock).mockResolvedValue({
      user: {
        nhs_number: nhsNumber,
      },
    });
    const fakeHeaders: ReadonlyHeaders = {
      get(name: string): string | null {
        return `fake-${name}-header`;
      },
    } as ReadonlyHeaders;
    (headers as jest.Mock).mockResolvedValue(fakeHeaders);
  });

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
    });

    it("should include overview text", async () => {
      await renderNamedVaccinePage(VaccineTypes.TD_IPV_3_IN_1);

      const overviewText: HTMLElement = screen.getByTestId("overview-text");

      expect(overviewText).toBeInTheDocument();
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

    it("should display custom RSV Pregnancy vaccine component with contentApi howToGet section", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      const rsvPregnancyInfo = screen.queryByTestId("rsv-pregnancy-mock");

      expect(rsvPregnancyInfo).toBeInTheDocument();
      expect(RSVPregnancyInfo).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.RSV_PREGNANCY,
          howToGetVaccineOrFallback: mockStyledContent.howToGetVaccine.component,
        },
        undefined,
      );
    });

    it("should not display RSV Pregnancy component when vaccineType is not RSV_PREGNANCY", async () => {
      await renderNamedVaccinePage(VaccineTypes.TD_IPV_3_IN_1);

      const rsvPregnancyInfo = screen.queryByTestId("rsv-pregnancy-mock");

      expect(rsvPregnancyInfo).not.toBeInTheDocument();
      expect(RSVPregnancyInfo).not.toHaveBeenCalled();
    });

    it("should not display find out more link", async () => {
      await renderRsvVaccinePage();

      const findOutMore: HTMLElement | null = screen.queryByTestId("find-out-more-link-mock");

      expect(findOutMore).not.toBeInTheDocument();
    });

    it("should display hr above MoreInformation section when personalised eligibility not in use", async () => {
      await renderNamedVaccinePage(VaccineTypes.TD_IPV_3_IN_1);

      const hrAboveMoreInformation: HTMLElement = screen.getByTestId("more-information-hr");

      expect(hrAboveMoreInformation).toBeInTheDocument();
    });
  });

  describe("shows content section, when content load fails", () => {
    const eligibilityMockResult = {
      status: EligibilityStatus.NOT_ELIGIBLE,
      content: eligibilityContentBuilder().build(),
    };

    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibility: eligibilityMockResult,
      });
    });

    it("should not display overview paragraph", async () => {
      await renderNamedVaccinePage(VaccineTypes.TD_IPV_3_IN_1);

      const overviewText: HTMLElement | null = screen.queryByTestId("overview-text");

      expect(overviewText).not.toBeInTheDocument();
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

      const eligibilitySection: HTMLElement = screen.getByTestId("eligibility-page-content-mock");
      expect(eligibilitySection).toBeInTheDocument();

      expect(EligibilityVaccinePageContent).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.RSV,
          eligibility: eligibilityMockResult,
          eligibilityError: undefined,
          howToGetVaccineOrFallback: <HowToGetVaccineFallback vaccineType={VaccineTypes.RSV} />,
        },
        undefined,
      );
    });

    it("should use fallback how-to-get text when rendering rsv pregnancy component", async () => {
      const vaccineType = VaccineTypes.RSV_PREGNANCY;
      await renderNamedVaccinePage(vaccineType);

      expect(RSVPregnancyInfo).toHaveBeenCalledWith(
        {
          vaccineType: vaccineType,
          howToGetVaccineOrFallback: <HowToGetVaccineFallback vaccineType={vaccineType} />,
        },
        undefined,
      );
    });

    it("should still display hr above MoreInformation section", async () => {
      await renderNamedVaccinePage(VaccineTypes.TD_IPV_3_IN_1);

      const hrAboveMoreInformation: HTMLElement = screen.getByTestId("more-information-hr");

      expect(hrAboveMoreInformation).toBeInTheDocument();
    });
  });

  describe("shows eligibility section, when eligibility response available", () => {
    const eligibility = {
      status: EligibilityStatus.NOT_ELIGIBLE,
      content: eligibilityContentBuilder().build(),
    };

    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibility: eligibility,
      });
    });

    it("should display the eligibility on RSV vaccine page", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV);

      const eligibilitySection: HTMLElement = screen.getByTestId("eligibility-page-content-mock");
      expect(eligibilitySection).toBeInTheDocument();
      expect(EligibilityVaccinePageContent).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.RSV,
          eligibility: eligibility,
          eligibilityError: undefined,
          howToGetVaccineOrFallback: mockStyledContent.howToGetVaccine.component,
        },
        undefined,
      );
    });

    it("should not display the eligibility on RSV pregnancy vaccine page", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      const eligibilitySection: HTMLElement | null = screen.queryByTestId("eligibility-page-content-mock");
      expect(eligibilitySection).not.toBeInTheDocument();
    });

    it("should not call EliD API on RSV pregnancy vaccine page", async () => {
      await renderNamedVaccinePage(VaccineTypes.RSV_PREGNANCY);

      expect(getEligibilityForPerson).not.toHaveBeenCalled();
    });

    it("should not call EliD API on Td/IPV page pregnancy vaccine page", async () => {
      await renderNamedVaccinePage(VaccineTypes.TD_IPV_3_IN_1);

      expect(getEligibilityForPerson).not.toHaveBeenCalled();
    });

    it("should pass eligibility on to eligibility component even if there is no content ", async () => {
      const eligibilityResponseWithNoContentSection = {
        status: EligibilityStatus.NOT_ELIGIBLE,
        content: {
          summary: undefined,
          actions: [],
          suitabilityRules: [],
        },
      };
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibility: eligibilityResponseWithNoContentSection,
      });

      await renderNamedVaccinePage(VaccineTypes.RSV);

      const eligibilitySection: HTMLElement | null = screen.getByTestId("eligibility-page-content-mock");
      expect(eligibilitySection).toBeInTheDocument();
      expect(EligibilityVaccinePageContent).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.RSV,
          eligibility: eligibilityResponseWithNoContentSection,
          eligibilityError: undefined,
          howToGetVaccineOrFallback: mockStyledContent.howToGetVaccine.component,
        },
        undefined,
      );
    });

    it("should pass eligibilityLoadingError to eligibilityComponent when there is no session / no nhsNumber", async () => {
      (auth as jest.Mock).mockResolvedValue(undefined);

      await renderNamedVaccinePage(VaccineTypes.RSV);

      const eligibilitySection: HTMLElement = screen.getByTestId("eligibility-page-content-mock");
      expect(eligibilitySection).toBeInTheDocument();
      expect(EligibilityVaccinePageContent).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.RSV,
          eligibility: undefined,
          eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
          howToGetVaccineOrFallback: mockStyledContent.howToGetVaccine.component,
        },
        undefined,
      );
    });

    it("should not display hr above MoreInformation section when personalised eligibility is use", async () => {
      // Personalised actions are always separated by hr; avoids duplicate line appearing after final element
      await renderNamedVaccinePage(VaccineTypes.RSV);

      const hrAboveMoreInformation: HTMLElement | null = screen.queryByTestId("more-information-hr");

      expect(hrAboveMoreInformation).not.toBeInTheDocument();
    });
  });

  describe("shows eligibility section, when eligibility response not available", () => {
    const eligibilityUnavailable = {
      eligibility: undefined,
      eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
    };

    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilityUnavailable);
    });

    it("should call eligibility component with error response when eligibility API has failed", async () => {
      const vaccineType = VaccineTypes.RSV;
      await renderNamedVaccinePage(vaccineType);

      const eligibilitySection: HTMLElement = screen.getByTestId("eligibility-page-content-mock");
      expect(eligibilitySection).toBeInTheDocument();
      expect(EligibilityVaccinePageContent).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.RSV,
          eligibility: undefined,
          eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
          howToGetVaccineOrFallback: mockStyledContent.howToGetVaccine.component,
        },
        undefined,
      );
    });
  });

  describe("shows content and eligibility sections, when eligibility AND content not available", () => {
    const eligibilityUnavailable = {
      eligibility: undefined,
      eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
    };

    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilityUnavailable);
    });

    it("should use fallback how-to-get text when rendering eligibility fallback component", async () => {
      const vaccineType = VaccineTypes.RSV;

      await renderNamedVaccinePage(vaccineType);

      const eligibilitySection: HTMLElement = screen.getByTestId("eligibility-page-content-mock");
      expect(eligibilitySection).toBeInTheDocument();
      expect(EligibilityVaccinePageContent).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.RSV,
          eligibility: undefined,
          eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
          howToGetVaccineOrFallback: <HowToGetVaccineFallback vaccineType={VaccineTypes.RSV} />,
        },
        undefined,
      );
    });
  });
});
