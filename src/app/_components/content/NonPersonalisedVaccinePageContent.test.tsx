import { VaccineType } from "@project/src/models/vaccine";
import { StyledVaccineContent } from "@project/src/services/content-api/types";
import { mockStyledContent } from "@project/test-data/content-api/data";
import { CampaignState } from "@src/utils/campaigns/campaignState";
import { render, screen } from "@testing-library/react";

import { NonPersonalisedVaccinePageContent } from "./NonPersonalisedVaccinePageContent";

jest.mock("react-markdown", () =>
  jest.fn(function MockMarkdown(props) {
    return <div data-testid="markdown">{props.children}</div>;
  }),
);
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

describe("NonPersonalisedVaccinePageContent", () => {
  describe("shows content section, when content available", () => {
    const campaignStates = [
      CampaignState.OPEN,
      CampaignState.PRE_OPEN,
      CampaignState.CLOSED,
      CampaignState.UNSUPPORTED,
    ];

    it.each(campaignStates)("should include overview text when campaign is %s", async (campaignState) => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, VaccineType.TD_IPV_3_IN_1, campaignState);

      const overviewText: HTMLElement = screen.getByText("Overview text");

      expect(overviewText).toBeInTheDocument();
    });

    it.each(campaignStates)("should include recommendation text when campaign is %s", async (campaignState) => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, VaccineType.FLU_IN_PREGNANCY, campaignState);

      const recommendationText: HTMLElement = screen.getByRole("heading", {
        name: "Non-urgent advice: Recommendation Heading",
        level: 2,
      });

      expect(recommendationText).toBeInTheDocument();
    });

    it.each(campaignStates)("should include additionalInformation text when %s", async (campaignState) => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, VaccineType.MMRV, campaignState);

      const additionalInformation: HTMLElement = screen.getByText("Additional Information component");

      expect(additionalInformation).toBeInTheDocument();
    });

    it.each(campaignStates)("should not include additionalInformation text when %s", async (campaignState) => {
      await renderNonPersonalisedVaccinePage(
        { ...mockStyledContent, additionalInformation: undefined },
        VaccineType.MMRV,
        campaignState,
      );

      const additionalInformation: HTMLElement | null = screen.queryByText("Additional Information component");

      expect(additionalInformation).not.toBeInTheDocument();
    });
  });

  describe("shows content section, when content available for Vaccines that do not have campaigns", () => {
    it("should not include actions", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, VaccineType.COVID_19, CampaignState.UNSUPPORTED);

      const actions: HTMLElement | null = screen.queryByRole("button", { name: "Continue to booking" });

      expect(actions).toBe(null);
    });

    it("should not include PreOpen actions", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, VaccineType.COVID_19, CampaignState.UNSUPPORTED);

      const preOpenActions: HTMLElement | null = screen.queryByRole("button", {
        name: "Book, cancel or change an appointment",
      });

      expect(preOpenActions).toBe(null);
    });
  });

  describe("shows callouts and actions for Vaccines that handle campaigns (COVID_19)", () => {
    const covid19VaccineType = VaccineType.COVID_19;

    it("should include callout heading when campaign is closed", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, CampaignState.CLOSED);

      const calloutHeading: HTMLElement = screen.getByRole("heading", { name: "Important: Callout Heading" });

      expect(calloutHeading).toBeInTheDocument();
    });

    it("should not include callout heading when campaign is open", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, CampaignState.OPEN);

      const calloutHeading: HTMLElement | null = screen.queryByRole("heading", { name: "Important: Callout Heading" });

      expect(calloutHeading).toBeNull();
    });

    it("should not include callout heading when campaign is pre-open", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, CampaignState.PRE_OPEN);

      const calloutHeading: HTMLElement | null = screen.queryByRole("heading", { name: "Important: Callout Heading" });

      expect(calloutHeading).toBeNull();
    });

    it("should include actions when campaign is open", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, CampaignState.OPEN);

      const actions: HTMLElement = screen.getByRole("button", { name: "Continue to booking" });

      expect(actions).toBeInTheDocument();
    });

    it("should not include open campaign actions when campaign is pre-open", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, CampaignState.PRE_OPEN);

      const actions: HTMLElement | null = screen.queryByRole("button", { name: "Continue to booking" });

      expect(actions).toBeNull();
    });

    it("should not include actions when campaign is closed", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, CampaignState.CLOSED);

      const actions: HTMLElement | null = screen.queryByRole("button", { name: "Continue to booking" });

      expect(actions).toBeNull();
    });

    it("should include pre-open actions when campaign is pre-open", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, CampaignState.PRE_OPEN);

      const preOpenActions: HTMLElement = screen.getByRole("button", { name: "Book, cancel or change an appointment" });

      expect(preOpenActions).toBeInTheDocument();
    });

    it("should not include pre-open actions when campaign is open", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, CampaignState.OPEN);

      const preOpenActions: HTMLElement | null = screen.queryByRole("button", {
        name: "Book, cancel or change an appointment",
      });

      expect(preOpenActions).toBeNull();
    });

    it("should not include pre-open actions when campaign is closed", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, CampaignState.CLOSED);

      const preOpenActions: HTMLElement | null = screen.queryByRole("button", {
        name: "Book, cancel or change an appointment",
      });

      expect(preOpenActions).toBeNull();
    });
  });

  describe("when showStaticEligibilityContent is false", () => {
    const campaignStates = [
      CampaignState.OPEN,
      CampaignState.PRE_OPEN,
      CampaignState.CLOSED,
      CampaignState.UNSUPPORTED,
    ];

    it.each(campaignStates)("should include overview text when campaign is %s", (campaignState) => {
      renderNonPersonalisedVaccinePageWithoutStaticEligibility(mockStyledContent, VaccineType.COVID_19, campaignState);

      expect(screen.getByText("Overview text")).toBeInTheDocument();
    });

    it.each(campaignStates)("should not include recommendation text when campaign is %s", (campaignState) => {
      renderNonPersonalisedVaccinePageWithoutStaticEligibility(mockStyledContent, VaccineType.COVID_19, campaignState);

      expect(
        screen.queryByRole("heading", { name: "Non-urgent advice: Recommendation Heading", level: 2 }),
      ).not.toBeInTheDocument();
    });

    it.each(campaignStates)("should not include additionalInformation when campaign is %s", (campaignState) => {
      renderNonPersonalisedVaccinePageWithoutStaticEligibility(mockStyledContent, VaccineType.COVID_19, campaignState);

      expect(screen.queryByText("Additional Information component")).not.toBeInTheDocument();
    });

    it("should not include open campaign actions when campaign is open", () => {
      renderNonPersonalisedVaccinePageWithoutStaticEligibility(
        mockStyledContent,
        VaccineType.COVID_19,
        CampaignState.OPEN,
      );

      expect(screen.queryByRole("button", { name: "Continue to booking" })).toBeNull();
    });

    it("should not include pre-open actions when campaign is pre-open", () => {
      renderNonPersonalisedVaccinePageWithoutStaticEligibility(
        mockStyledContent,
        VaccineType.COVID_19,
        CampaignState.PRE_OPEN,
      );

      expect(screen.queryByRole("button", { name: "Book, cancel or change an appointment" })).toBeNull();
    });
  });
});

const renderNonPersonalisedVaccinePage = async (
  styledVaccineContent: StyledVaccineContent,
  vaccineType: VaccineType,
  campaignState: CampaignState,
) => {
  render(
    NonPersonalisedVaccinePageContent({
      styledVaccineContent,
      vaccineType,
      campaignState,
      showStaticEligibilityContent: true,
    }),
  );
};

const renderNonPersonalisedVaccinePageWithoutStaticEligibility = (
  styledVaccineContent: StyledVaccineContent,
  vaccineType: VaccineType,
  campaignState: CampaignState,
) => {
  render(
    NonPersonalisedVaccinePageContent({
      styledVaccineContent,
      vaccineType,
      campaignState,
      showStaticEligibilityContent: false,
    }),
  );
};
