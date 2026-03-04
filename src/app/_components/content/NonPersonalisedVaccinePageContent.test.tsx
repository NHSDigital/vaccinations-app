import { VaccineType } from "@project/src/models/vaccine";
import { StyledVaccineContent } from "@project/src/services/content-api/types";
import { mockStyledContent } from "@project/test-data/content-api/data";
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
    const testCases = [
      {
        campaignPreOpen: false,
        campaignOpen: false,
      },
      {
        campaignPreOpen: true,
        campaignOpen: false,
      },
      {
        campaignPreOpen: false,
        campaignOpen: true,
      },
      {
        campaignPreOpen: true,
        campaignOpen: true,
      },
    ];

    it.each(testCases)("should include overview text when %s", async ({ campaignPreOpen, campaignOpen }) => {
      await renderNonPersonalisedVaccinePage(
        mockStyledContent,
        VaccineType.TD_IPV_3_IN_1,
        campaignOpen,
        campaignPreOpen,
      );

      const overviewText: HTMLElement = screen.getByText("Overview text");

      expect(overviewText).toBeInTheDocument();
    });

    it.each(testCases)("should include recommendation text when %s", async ({ campaignPreOpen, campaignOpen }) => {
      await renderNonPersonalisedVaccinePage(
        mockStyledContent,
        VaccineType.FLU_IN_PREGNANCY,
        campaignOpen,
        campaignPreOpen,
      );

      const recommendationText: HTMLElement = screen.getByRole("heading", {
        name: "Non-urgent advice: Recommendation Heading",
        level: 2,
      });

      expect(recommendationText).toBeInTheDocument();
    });

    it.each(testCases)(
      "should include additionalInformation text when %s",
      async ({ campaignPreOpen, campaignOpen }) => {
        await renderNonPersonalisedVaccinePage(mockStyledContent, VaccineType.MMRV, campaignOpen, campaignPreOpen);

        const additionalInformation: HTMLElement = screen.getByText("Additional Information component");

        expect(additionalInformation).toBeInTheDocument();
      },
    );

    it.each(testCases)(
      "should not include additionalInformation text when %s",
      async ({ campaignPreOpen, campaignOpen }) => {
        await renderNonPersonalisedVaccinePage(
          { ...mockStyledContent, additionalInformation: undefined },
          VaccineType.MMRV,
          campaignOpen,
          campaignPreOpen,
        );

        const additionalInformation: HTMLElement | null = screen.queryByText("Additional Information component");

        expect(additionalInformation).not.toBeInTheDocument();
      },
    );
  });

  describe("shows content section, when content available for Vaccines that do not have campagins", () => {
    const campaignPreOpen = false;
    const campaignOpen = false;

    it("should not include actions", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, VaccineType.COVID_19, campaignOpen, campaignPreOpen);

      const actions: HTMLElement | null = screen.queryByRole("button", { name: "Continue to booking" });

      expect(actions).toBe(null);
    });

    it("should not include PreOpen actions", async () => {
      await renderNonPersonalisedVaccinePage(mockStyledContent, VaccineType.COVID_19, campaignOpen, campaignPreOpen);

      const preOpenActions: HTMLElement | null = screen.queryByRole("button", {
        name: "Book, cancel or change an appointment",
      });

      expect(preOpenActions).toBe(null);
    });
  });

  describe("shows callouts and actions for Vaccines that handle campaigns (COVID_19)", () => {
    const covid19VaccineType = VaccineType.COVID_19;

    it("should include callout heading when campaign is closed", async () => {
      const campaignOpen = false;
      const campaignPreOpen = false;

      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, campaignOpen, campaignPreOpen);

      const calloutHeading: HTMLElement = screen.getByRole("heading", { name: "Important: Callout Heading" });

      expect(calloutHeading).toBeInTheDocument();
    });

    it("should not include callout heading when campaign is open", async () => {
      const campaignOpen = true;
      const campaignPreOpen = false;

      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, campaignOpen, campaignPreOpen);

      const calloutHeading: HTMLElement | null = screen.queryByRole("heading", { name: "Important: Callout Heading" });

      expect(calloutHeading).toBeNull();
    });

    it("should not include callout heading when campaign is pre-open", async () => {
      const campaignOpen = false;
      const campaignPreOpen = true;

      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, campaignOpen, campaignPreOpen);

      const calloutHeading: HTMLElement | null = screen.queryByRole("heading", { name: "Important: Callout Heading" });

      expect(calloutHeading).toBeNull();
    });

    it("should include actions when campaign is open", async () => {
      const campaignOpen = true;
      const campaignPreOpen = false;

      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, campaignOpen, campaignPreOpen);

      const actions: HTMLElement = screen.getByRole("button", { name: "Continue to booking" });

      expect(actions).toBeInTheDocument();
    });

    it("should not include open campaign actions when campaign is pre-open", async () => {
      const campaignOpen = false;
      const campaignPreOpen = true;

      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, campaignOpen, campaignPreOpen);

      const actions: HTMLElement | null = screen.queryByRole("button", { name: "Continue to booking" });

      expect(actions).toBeNull();
    });

    it("should not include actions when campaign is closed", async () => {
      const campaignOpen = false;
      const campaignPreOpen = false;

      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, campaignOpen, campaignPreOpen);

      const actions: HTMLElement | null = screen.queryByRole("button", { name: "Continue to booking" });

      expect(actions).toBeNull();
    });

    it("should include pre-open actions when campaign is pre-open", async () => {
      const campaignOpen = false;
      const campaignPreOpen = true;

      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, campaignOpen, campaignPreOpen);

      const preOpenActions: HTMLElement = screen.getByRole("button", { name: "Book, cancel or change an appointment" });

      expect(preOpenActions).toBeInTheDocument();
    });

    it("should not include pre-open actions when campaign is open", async () => {
      const campaignOpen = true;
      const campaignPreOpen = false;

      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, campaignOpen, campaignPreOpen);

      const preOpenActions: HTMLElement | null = screen.queryByRole("button", {
        name: "Book, cancel or change an appointment",
      });

      expect(preOpenActions).toBeNull();
    });

    it("should not include pre-open actions when campaign is closed", async () => {
      const campaignOpen = false;
      const campaignPreOpen = false;

      await renderNonPersonalisedVaccinePage(mockStyledContent, covid19VaccineType, campaignOpen, campaignPreOpen);

      const preOpenActions: HTMLElement | null = screen.queryByRole("button", {
        name: "Book, cancel or change an appointment",
      });

      expect(preOpenActions).toBeNull();
    });
  });
});

const renderNonPersonalisedVaccinePage = async (
  styledVaccineContent: StyledVaccineContent,
  vaccineType: VaccineType,
  isCampaignOpen: boolean,
  isCampaignPreOpen: boolean,
) => {
  render(
    await NonPersonalisedVaccinePageContent({
      styledVaccineContent,
      vaccineType,
      isCampaignOpen,
      isCampaignPreOpen,
    }),
  );
};
