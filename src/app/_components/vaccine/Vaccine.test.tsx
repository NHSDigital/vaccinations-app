import { auth } from "@project/auth";
import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { MoreInformationSection } from "@src/app/_components/content/MoreInformationSection";
import { EligibilityVaccinePageContent } from "@src/app/_components/eligibility/EligibilityVaccinePageContent";
import Vaccine, { shouldShowHowToGetExpander } from "@src/app/_components/vaccine/Vaccine";
import { VaccineType } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { ContentErrorTypes } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import {
  EligibilityErrorTypes,
  EligibilityForPersonType,
  EligibilityStatus,
} from "@src/services/eligibility-api/types";
import { getCampaignState } from "@src/utils/campaigns/campaign-state-evaluator";
import { CampaignState } from "@src/utils/campaigns/campaignState";
import { mockStyledContent } from "@test-data/content-api/data";
import { eligibilityContentBuilder } from "@test-data/eligibility-api/builders";
import { render, screen } from "@testing-library/react";
import React, { JSX } from "react";

jest.mock("@src/services/content-api/content-service", () => ({
  getContentForVaccine: jest.fn(),
}));
jest.mock("@src/services/eligibility-api/domain/eligibility-filter-service", () => ({
  getEligibilityForPerson: jest.fn(),
}));
jest.mock("@src/utils/campaigns/campaign-state-evaluator", () => ({
  getCampaignState: jest.fn(),
}));
// it would be good to avoid these mocks and rather than do getByTestId(id) use getByRole(role, {name: id})
jest.mock("@src/app/_components/eligibility/EligibilityVaccinePageContent", () => ({
  EligibilityVaccinePageContent: jest
    .fn()
    .mockImplementation(() => (
      <div data-testid="eligibility-page-content-mock">Test Eligibility Content Component</div>
    )),
}));
jest.mock("@src/app/_components/content/MoreInformationSection", () => ({
  MoreInformationSection: jest
    .fn()
    .mockImplementation(() => (
      <div data-testid="more-information-section">Test More Information Section Component</div>
    )),
}));
jest.mock("@src/app/_components/content/NonPersonalisedVaccinePageContent", () => ({
  NonPersonalisedVaccinePageContent: jest.fn().mockImplementation((props) => {
    if (props.campaignState == CampaignState.OPEN) {
      return (
        <div data-testid="non-personalised-content-mock-open">Test Non-personalised Vaccine Page Content Component</div>
      );
    } else if (props.campaignState == CampaignState.PRE_OPEN) {
      return (
        <div data-testid="non-personalised-content-mock-preopen">
          Test Non-personalised Vaccine Page Content Component
        </div>
      );
    } else {
      return (
        <div data-testid="non-personalised-content-mock">Test Non-personalised Vaccine Page Content Component</div>
      );
    }
  }),
}));
jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("next/headers", () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const nhsNumber = "5123456789";

const eligibilitySuccessResponse = {
  eligibility: {
    status: EligibilityStatus.NOT_ELIGIBLE,
    content: eligibilityContentBuilder().build(),
  },
  eligibilityError: undefined,
};

const eligibilityErrorResponse = {
  eligibility: undefined,
  eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
};

const contentSuccessResponse = {
  styledVaccineContent: mockStyledContent,
};

const contentErrorResponse = {
  styledVaccineContent: undefined,
  contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
};

describe("Any vaccine page", () => {
  const renderRsvVaccinePage = async () => {
    await renderNamedVaccinePage(VaccineType.RSV);
  };

  const expectTdIPVPageToHaveLineAboveMoreInformationSection = async () => {
    await renderNamedVaccinePage(VaccineType.TD_IPV_3_IN_1);

    const lineAboveMoreInformation: HTMLElement = screen.getByRole("separator");

    expect(lineAboveMoreInformation).toBeInTheDocument();
  };

  beforeEach(() => {
    (auth as jest.Mock).mockResolvedValue({
      user: {
        nhs_number: nhsNumber,
      },
    });
  });

  describe("shows content section, when content available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(contentSuccessResponse);
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilitySuccessResponse);
    });

    it("should display non-personalised vaccine page content", async () => {
      await renderNamedVaccinePage(VaccineType.RSV);

      const nonPersonalisedVaccinePageContent = screen.getByTestId("non-personalised-content-mock");

      expect(nonPersonalisedVaccinePageContent).toBeInTheDocument();
    });

    it("should include more information section", async () => {
      await renderRsvVaccinePage();

      const moreInfoSection: HTMLElement = screen.getByText("Test More Information Section Component");

      expect(moreInfoSection).toBeInTheDocument();
      expect(MoreInformationSection).toHaveBeenCalledWith(
        {
          styledVaccineContent: contentSuccessResponse.styledVaccineContent,
          vaccineType: VaccineType.RSV,
          showHowToGetSection: false, //about to refactor out to pass in campaign context instead?
        },
        undefined,
      );
    });

    it("should display custom RSV Pregnancy vaccine component", async () => {
      await renderNamedVaccinePage(VaccineType.RSV_PREGNANCY);

      const rsvPregnancyInfo: HTMLElement = screen.getByRole("heading", {
        name: "Non-urgent advice: The RSV vaccine is recommended if you:",
      });

      expect(rsvPregnancyInfo).toBeInTheDocument();
    });

    it("should not display RSV Pregnancy component when vaccineType is not RSV_PREGNANCY", async () => {
      await renderNamedVaccinePage(VaccineType.TD_IPV_3_IN_1);

      const rsvPregnancyInfo: HTMLElement | null = screen.queryByRole("heading", {
        name: "Non-urgent advice: The RSV vaccine is recommended if you:",
      });

      expect(rsvPregnancyInfo).not.toBeInTheDocument();
    });

    it("should display hr above MoreInformation section when personalised eligibility not in use", async () => {
      await expectTdIPVPageToHaveLineAboveMoreInformationSection();
    });
  });

  describe("shows correct content for Vaccines that handle campaigns (COVID_19)", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(contentSuccessResponse);
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilitySuccessResponse);
    });

    it("should display non-personalised vaccine page content for PreOpen Campaign", async () => {
      (getCampaignState as jest.Mock).mockResolvedValue(CampaignState.PRE_OPEN);

      await renderNamedVaccinePage(VaccineType.COVID_19);

      const nonPersonalisedVaccinePageContent = screen.getByTestId("non-personalised-content-mock-preopen");

      expect(nonPersonalisedVaccinePageContent).toBeInTheDocument();
    });

    it("should display non-personalised vaccine page content for Open Campaign", async () => {
      (getCampaignState as jest.Mock).mockResolvedValue(CampaignState.OPEN);

      await renderNamedVaccinePage(VaccineType.COVID_19);

      const nonPersonalisedVaccinePageContent = screen.getByTestId("non-personalised-content-mock-open");

      expect(nonPersonalisedVaccinePageContent).toBeInTheDocument();
    });

    it("should display non-personalised vaccine page content for Closed Campaign", async () => {
      (getCampaignState as jest.Mock).mockResolvedValue(CampaignState.CLOSED);

      await renderNamedVaccinePage(VaccineType.COVID_19);

      const nonPersonalisedVaccinePageContent = screen.getByTestId("non-personalised-content-mock");

      expect(nonPersonalisedVaccinePageContent).toBeInTheDocument();
    });
  });

  describe("shows content section, when content load fails", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(contentErrorResponse);
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilitySuccessResponse);
    });

    it("should not display non-personalised vaccine page content", async () => {
      await renderNamedVaccinePage(VaccineType.RSV);

      const nonPersonalisedVaccinePageContent = screen.queryByTestId("non-personalised-content-mock");

      expect(nonPersonalisedVaccinePageContent).not.toBeInTheDocument();
    });

    it("should still render More Information section", async () => {
      const vaccineType = VaccineType.RSV;
      await renderNamedVaccinePage(vaccineType);

      const moreInfoSection: HTMLElement = screen.getByText("Test More Information Section Component");

      expect(moreInfoSection).toBeInTheDocument();

      expect(MoreInformationSection).toHaveBeenCalledWith(
        {
          styledVaccineContent: contentErrorResponse.styledVaccineContent,
          vaccineType: vaccineType,
          showHowToGetSection: false, //about to refactor out to pass in campaign context instead?
        },
        undefined,
      );
    });

    it("should still render eligibility section of vaccine page", async () => {
      await renderRsvVaccinePage();

      expectRenderEligibilitySectionWith(
        VaccineType.RSV,
        eligibilitySuccessResponse,
        <HowToGetVaccineFallback vaccineType={VaccineType.RSV} />,
      );
    });

    it("should use fallback rsv pregnancy component when RSV pregnancy vaccine", async () => {
      const vaccineType = VaccineType.RSV_PREGNANCY;
      await renderNamedVaccinePage(vaccineType);

      const RSVPregnancyInfo: HTMLElement = screen.getByRole("heading", {
        name: "Non-urgent advice: The RSV vaccine is recommended if you:",
      });

      expect(RSVPregnancyInfo).toBeInTheDocument();
    });

    it("should still display line above MoreInformation section", async () => {
      await expectTdIPVPageToHaveLineAboveMoreInformationSection();
    });
  });

  describe("shows eligibility section, when eligibility response available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(contentSuccessResponse);
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilitySuccessResponse);
    });

    it("should display the eligibility on RSV vaccine page", async () => {
      await renderRsvVaccinePage();

      expectRenderEligibilitySectionWith(
        VaccineType.RSV,
        eligibilitySuccessResponse,
        mockStyledContent.howToGetVaccine.component,
      );
    });

    it("should not display the eligibility on RSV pregnancy vaccine page", async () => {
      await renderNamedVaccinePage(VaccineType.RSV_PREGNANCY);

      const eligibilitySection: HTMLElement | null = screen.queryByTestId("eligibility-page-content-mock");
      expect(eligibilitySection).not.toBeInTheDocument();
    });

    it("should not call EliD API on RSV pregnancy vaccine page", async () => {
      await renderNamedVaccinePage(VaccineType.RSV_PREGNANCY);

      expect(getEligibilityForPerson).not.toHaveBeenCalled();
    });

    it("should not call EliD API on Td/IPV page pregnancy vaccine page", async () => {
      await renderNamedVaccinePage(VaccineType.TD_IPV_3_IN_1);

      expect(getEligibilityForPerson).not.toHaveBeenCalled();
    });

    it("should pass eligibility on to eligibility component even if there is no content ", async () => {
      const eligibilityResponseWithNoContentSection = {
        eligibility: {
          status: EligibilityStatus.NOT_ELIGIBLE,
          content: {
            summary: undefined,
            actions: [],
            suitabilityRules: [],
          },
        },
        eligibilityError: undefined,
      };
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilityResponseWithNoContentSection);

      await renderRsvVaccinePage();

      expectRenderEligibilitySectionWith(
        VaccineType.RSV,
        eligibilityResponseWithNoContentSection,
        mockStyledContent.howToGetVaccine.component,
      );
    });

    it("should pass eligibilityLoadingError to eligibilityComponent when there is no session / no nhsNumber", async () => {
      (auth as jest.Mock).mockResolvedValue(undefined);

      await renderRsvVaccinePage();

      expectRenderEligibilitySectionWith(
        VaccineType.RSV,
        eligibilityErrorResponse,
        mockStyledContent.howToGetVaccine.component,
      );
    });

    it("should always display line above MoreInformation section", async () => {
      await renderRsvVaccinePage();

      const lineAboveMoreInformation: HTMLElement = screen.getByRole("separator");

      expect(lineAboveMoreInformation).toBeInTheDocument();
    });
  });

  describe("shows eligibility section, when eligibility response not available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(contentSuccessResponse);
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilityErrorResponse);
    });

    it("should call eligibility component with error response when eligibility API has failed", async () => {
      const vaccineType = VaccineType.RSV;
      await renderNamedVaccinePage(vaccineType);

      expectRenderEligibilitySectionWith(
        VaccineType.RSV,
        eligibilityErrorResponse,
        mockStyledContent.howToGetVaccine.component,
      );
    });
  });

  describe("shows content and eligibility sections, when eligibility AND content not available", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(contentErrorResponse);
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilityErrorResponse);
    });

    it("should use fallback how-to-get text when rendering eligibility fallback component", async () => {
      const vaccineType = VaccineType.RSV;

      await renderNamedVaccinePage(vaccineType);

      expectRenderEligibilitySectionWith(
        vaccineType,
        eligibilityErrorResponse,
        <HowToGetVaccineFallback vaccineType={vaccineType} />,
      );
    });
  });

  const renderNamedVaccinePage = async (vaccineType: VaccineType) => {
    render(await Vaccine({ vaccineType }));
  };

  const expectRenderEligibilitySectionWith = (
    vaccineType: VaccineType,
    eligibilityForPerson: EligibilityForPersonType,
    howToGetVaccineOrFallback: JSX.Element,
  ) => {
    const eligibilitySection: HTMLElement = screen.getByTestId("eligibility-page-content-mock");
    expect(eligibilitySection).toBeInTheDocument();
    expect(EligibilityVaccinePageContent).toHaveBeenCalledWith(
      {
        vaccineType: vaccineType,
        eligibilityForPerson: eligibilityForPerson,
        howToGetVaccineOrFallback: howToGetVaccineOrFallback,
      },
      undefined,
    );
  };
});

describe("shouldShowHowToGetSection", () => {
  // TODO: VIA-832 a lot of these cases are impossible due to how campaigns work (cannot be open and preopen at same time); do we need all of these or only four?
  // TODO: VIA-832 also consider how show/hide vaccine settings affect this; is this the correct assertion?
  it.each([
    [VaccineType.TD_IPV_3_IN_1, CampaignState.UNSUPPORTED, true],
    [VaccineType.VACCINE_6_IN_1, CampaignState.CLOSED, true],
    [VaccineType.ROTAVIRUS, CampaignState.OPEN, false],
    [VaccineType.HPV, CampaignState.PRE_OPEN, false],
    [VaccineType.MENB_CHILDREN, CampaignState.UNSUPPORTED, true],
    [VaccineType.MMR, CampaignState.UNSUPPORTED, true],
    [VaccineType.RSV, CampaignState.UNSUPPORTED, false],
    [VaccineType.RSV_PREGNANCY, CampaignState.UNSUPPORTED, false],
    [VaccineType.FLU_FOR_SCHOOL_AGED_CHILDREN, CampaignState.CLOSED, false],
  ])(
    `should decide if to show hotToGet Section for: %s, campaigns: %s, open: %s, PreOpen %s, expected: %s`,
    async (vaccineType, campaignState, expected) => {
      const actual = await shouldShowHowToGetExpander(vaccineType, campaignState);

      expect(actual).toBe(expected);
    },
  );
});
