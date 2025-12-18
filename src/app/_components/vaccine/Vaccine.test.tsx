import { auth } from "@project/auth";
import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { EligibilityVaccinePageContent } from "@src/app/_components/eligibility/EligibilityVaccinePageContent";
import { RSVPregnancyInfo } from "@src/app/_components/vaccine-custom/RSVPregnancyInfo";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineType } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { ContentErrorTypes } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import {
  EligibilityErrorTypes,
  EligibilityForPersonType,
  EligibilityStatus,
} from "@src/services/eligibility-api/types";
import { Campaigns } from "@src/utils/campaigns/types";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
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
jest.mock("@src/app/_components/eligibility/EligibilityActions", () => ({
  EligibilityActions: jest.fn().mockImplementation(() => <div data-testid="eligibility-actions-mock">Actions</div>),
}));
jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/config");
jest.mock("cheerio", () => ({
  load: jest.fn(() => {
    const selectorImpl = jest.fn(() => ({
      attr: jest.fn(),
    }));

    return Object.assign(selectorImpl, {
      html: jest.fn(() => "<p>HTML fragment</p>"),
    });
  }),
}));

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
  const mockedConfig = config as ConfigMock;

  beforeEach(() => {
    const defaultConfig = configBuilder()
      .withCampaigns(
        Campaigns.fromJson(
          JSON.stringify({
            COVID_19: [{ start: "2025-11-01T09:00:00Z", end: "2026-01-31T09:00:00Z" }],
          }),
        )!,
      )
      .build();
    Object.assign(mockedConfig, defaultConfig);
  });

  const renderRsvVaccinePage = async () => {
    await renderNamedVaccinePage(VaccineType.RSV);
  };

  const expectTdIPVPageToHaveHrAboveMoreInformationSection = async () => {
    await renderNamedVaccinePage(VaccineType.TD_IPV_3_IN_1);

    const hrAboveMoreInformation: HTMLElement = screen.getByTestId("more-information-hr");

    expect(hrAboveMoreInformation).toBeInTheDocument();
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

    it("should include overview text", async () => {
      await renderNamedVaccinePage(VaccineType.TD_IPV_3_IN_1);

      const overviewText: HTMLElement = screen.getByTestId("overview-text");

      expect(overviewText).toBeInTheDocument();
    });

    it("should include recommendation text", async () => {
      await renderNamedVaccinePage(VaccineType.FLU_IN_PREGNANCY);

      const overviewText: HTMLElement = screen.getByTestId("recommendation");

      expect(overviewText).toBeInTheDocument();
    });

    it("should include callout text", async () => {
      await renderNamedVaccinePage(VaccineType.MMR);

      const calloutText: HTMLElement = screen.getByTestId("callout");

      expect(calloutText).toBeInTheDocument();
    });

    it("should include actions", async () => {
      await renderNamedVaccinePage(VaccineType.COVID_19);

      const calloutText: HTMLElement = screen.getByTestId("eligibility-actions-mock");

      expect(calloutText).toBeInTheDocument();
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
      await renderNamedVaccinePage(VaccineType.RSV_PREGNANCY);

      const rsvPregnancyInfo: HTMLElement = screen.getByTestId("rsv-pregnancy-mock");

      expect(rsvPregnancyInfo).toBeInTheDocument();
      expect(RSVPregnancyInfo).toHaveBeenCalledWith(
        {
          vaccineType: VaccineType.RSV_PREGNANCY,
          howToGetVaccineOrFallback: mockStyledContent.howToGetVaccine.component,
        },
        undefined,
      );
    });

    it("should not display RSV Pregnancy component when vaccineType is not RSV_PREGNANCY", async () => {
      await renderNamedVaccinePage(VaccineType.TD_IPV_3_IN_1);

      const rsvPregnancyInfo: HTMLElement | null = screen.queryByTestId("rsv-pregnancy-mock");

      expect(rsvPregnancyInfo).not.toBeInTheDocument();
      expect(RSVPregnancyInfo).not.toHaveBeenCalled();
    });

    it("should not display find out more link", async () => {
      await renderRsvVaccinePage();

      const findOutMore: HTMLElement | null = screen.queryByTestId("find-out-more-link-mock");

      expect(findOutMore).not.toBeInTheDocument();
    });

    it("should display hr above MoreInformation section when personalised eligibility not in use", async () => {
      await expectTdIPVPageToHaveHrAboveMoreInformationSection();
    });
  });

  describe("shows callouts and actions for Vaccines that handle campaigns (COVID_19)", () => {
    const mockedConfig = config as ConfigMock;
    const campaigns = new Campaigns({});
    const covid19VaccineType = VaccineType.COVID_19;

    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(contentSuccessResponse);
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilitySuccessResponse);
      const defaultConfig = configBuilder().withCampaigns(campaigns).build();
      Object.assign(mockedConfig, defaultConfig);
    });

    it("should include callout text when campaign is inactive", async () => {
      const inactiveCampaignSpy = jest.spyOn(campaigns, "isActive").mockReturnValue(false);
      await renderNamedVaccinePage(covid19VaccineType);

      const calloutText: HTMLElement = screen.getByTestId("callout");

      expect(inactiveCampaignSpy).toHaveBeenCalledWith(covid19VaccineType, expect.any(Date));
      expect(calloutText).toBeInTheDocument();
      inactiveCampaignSpy.mockRestore();
    });

    it("should not include callout text when campaign is active", async () => {
      const activeCampaignSpy = jest.spyOn(campaigns, "isActive").mockReturnValue(true);
      await renderNamedVaccinePage(covid19VaccineType);

      const calloutText: HTMLElement | null = screen.queryByTestId("callout");

      expect(activeCampaignSpy).toHaveBeenCalledWith(covid19VaccineType, expect.any(Date));
      expect(calloutText).toBeNull();
      activeCampaignSpy.mockRestore();
    });

    it("should include actions when campaign is active", async () => {
      const activeCampaignSpy = jest.spyOn(campaigns, "isActive").mockReturnValue(true);
      await renderNamedVaccinePage(covid19VaccineType);

      const actions: HTMLElement = screen.getByTestId("eligibility-actions-mock");
      expect(activeCampaignSpy).toHaveBeenCalledWith(covid19VaccineType, expect.any(Date));
      expect(actions).toBeInTheDocument();
      activeCampaignSpy.mockRestore();
    });

    it("should not include actions when campaign is inactive", async () => {
      const inactiveCampaignSpy = jest.spyOn(campaigns, "isActive").mockReturnValue(false);
      await renderNamedVaccinePage(covid19VaccineType);

      const actions: HTMLElement | null = screen.queryByTestId("eligibility-actions-mock");
      expect(inactiveCampaignSpy).toHaveBeenCalledWith(covid19VaccineType, expect.any(Date));
      expect(actions).toBeNull();
      inactiveCampaignSpy.mockRestore();
    });
  });

  describe("shows content section, when content load fails", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(contentErrorResponse);
      (getEligibilityForPerson as jest.Mock).mockResolvedValue(eligibilitySuccessResponse);
    });

    it("should not display overview paragraph", async () => {
      await renderNamedVaccinePage(VaccineType.TD_IPV_3_IN_1);

      const overviewText: HTMLElement | null = screen.queryByTestId("overview-text");

      expect(overviewText).not.toBeInTheDocument();
    });

    it("should not display callout", async () => {
      await renderNamedVaccinePage(VaccineType.HPV);

      const overviewText: HTMLElement | null = screen.queryByTestId("callout");

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

      expectRenderEligibilitySectionWith(
        VaccineType.RSV,
        eligibilitySuccessResponse,
        <HowToGetVaccineFallback vaccineType={VaccineType.RSV} />,
      );
    });

    it("should use fallback how-to-get text when rendering rsv pregnancy component", async () => {
      const vaccineType = VaccineType.RSV_PREGNANCY;
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
      await expectTdIPVPageToHaveHrAboveMoreInformationSection();
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

    it("should display hr above MoreInformation section always", async () => {
      await renderRsvVaccinePage();

      const hrAboveMoreInformation: HTMLElement | null = screen.queryByTestId("more-information-hr");

      expect(hrAboveMoreInformation).toBeInTheDocument();
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
    render(await Vaccine({ vaccineType: vaccineType }));
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
