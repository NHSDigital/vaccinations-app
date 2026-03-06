import { FindOutMoreLink } from "@src/app/_components/content/FindOutMore";
import { MoreInformationExpanders } from "@src/app/_components/content/MoreInformationExpanders";
import {
  MoreInformationSection,
  shouldShowHowToGetExpander,
} from "@src/app/_components/content/MoreInformationSection";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { CampaignState } from "@src/utils/campaigns/campaignState";
import { mockStyledContent } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/content/MoreInformationExpanders", () => ({
  MoreInformationExpanders: jest
    .fn()
    .mockImplementation(() => <div data-testid="more-information-expanders">Test More Information Expanders</div>),
}));
jest.mock("@src/app/_components/content/FindOutMore", () => ({
  FindOutMoreLink: jest
    .fn()
    .mockImplementation(() => <div data-testid="find-out-more-link">Test Find Out More Link</div>),
}));

describe("MoreInformationSection", () => {
  describe("when styled vaccine content is available", () => {
    const styledVaccineContent = mockStyledContent;

    it("should include more information heading for vaccine", () => {
      const expectedMoreInformationHeading: string = "More information about the RSV vaccine";

      render(
        <MoreInformationSection
          styledVaccineContent={styledVaccineContent}
          vaccineType={VaccineType.RSV}
          campaignState={CampaignState.UNSUPPORTED}
        />,
      );

      const moreInfoHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: expectedMoreInformationHeading,
      });

      expect(moreInfoHeading).toBeInTheDocument();
    });

    it("should include more information expanders", () => {
      const expectedShouldShowHowToGetSection = false;

      render(
        <MoreInformationSection
          styledVaccineContent={styledVaccineContent}
          vaccineType={VaccineType.RSV}
          campaignState={CampaignState.UNSUPPORTED}
        />,
      );

      const moreInfoExpanders: HTMLElement = screen.getByText("Test More Information Expanders");

      expect(moreInfoExpanders).toBeInTheDocument();
      expect(MoreInformationExpanders).toHaveBeenCalledWith(
        {
          styledVaccineContent: styledVaccineContent,
          vaccineType: VaccineType.RSV,
          showHowToGetSection: expectedShouldShowHowToGetSection,
        },
        undefined,
      );
    });

    it("should include find out more link with url from styled vaccine content", () => {
      const vaccineType = VaccineType.RSV;
      render(
        <MoreInformationSection
          styledVaccineContent={styledVaccineContent}
          vaccineType={vaccineType}
          campaignState={CampaignState.UNSUPPORTED}
        />,
      );

      const findOurMoreLink: HTMLElement = screen.getByText("Test Find Out More Link");

      expect(findOurMoreLink).toBeInTheDocument();
      expect(FindOutMoreLink).toHaveBeenCalledWith(
        {
          findOutMoreUrl: styledVaccineContent.webpageLink,
          vaccineType: vaccineType,
        },
        undefined,
      );
    });
  });

  describe("when styled vaccine content is unavailable", () => {
    const unavailableStyledVaccineContent = undefined;

    it("should still show more information heading for vaccine", () => {
      const expectedMoreInformationHeading: string = "More information about the RSV vaccine";

      render(
        <MoreInformationSection
          styledVaccineContent={unavailableStyledVaccineContent}
          vaccineType={VaccineType.RSV}
          campaignState={CampaignState.UNSUPPORTED}
        />,
      );

      const moreInfoHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: expectedMoreInformationHeading,
      });

      expect(moreInfoHeading).toBeInTheDocument();
    });

    it("should not display more information expanders", () => {
      render(
        <MoreInformationSection
          styledVaccineContent={unavailableStyledVaccineContent}
          vaccineType={VaccineType.RSV}
          campaignState={CampaignState.UNSUPPORTED}
        />,
      );

      const moreInfoExpanders: HTMLElement | null = screen.queryByText("Test More Information Expanders");
      expect(moreInfoExpanders).not.toBeInTheDocument();
      expect(MoreInformationExpanders).not.toHaveBeenCalled();
    });

    it("should display find out more link with nhsWebpageLink from vaccine settings", async () => {
      const vaccineType = VaccineType.RSV;
      render(
        <MoreInformationSection
          styledVaccineContent={unavailableStyledVaccineContent}
          vaccineType={vaccineType}
          campaignState={CampaignState.UNSUPPORTED}
        />,
      );

      const findOurMoreLink: HTMLElement = screen.getByText("Test Find Out More Link");

      expect(findOurMoreLink).toBeInTheDocument();
      expect(FindOutMoreLink).toHaveBeenCalledWith(
        {
          findOutMoreUrl: VaccineInfo[vaccineType].nhsWebpageLink,
          vaccineType: vaccineType,
        },
        undefined,
      );
    });
  });
});

describe("shouldShowHowToGetSection", () => {
  describe("when removeHowToGetExpanderFromMoreInformationSection is set in Vaccine settings", () => {
    it.each([
      [VaccineType.RSV, CampaignState.UNSUPPORTED],
      [VaccineType.RSV_PREGNANCY, CampaignState.UNSUPPORTED],
      [VaccineType.FLU_FOR_SCHOOL_AGED_CHILDREN, CampaignState.CLOSED],
    ])(`should return false for %s, regardless of campaign state`, async (vaccineType, campaignState) => {
      const actual = shouldShowHowToGetExpander(vaccineType, campaignState);
      expect(actual).toBe(false);
    });
  });

  describe("using campaign state when removeHowToGetExpanderFromMoreInformationSection is not set", () => {
    it.each([
      [VaccineType.TD_IPV_3_IN_1, CampaignState.UNSUPPORTED, true],
      [VaccineType.VACCINE_6_IN_1, CampaignState.CLOSED, true],
      [VaccineType.ROTAVIRUS, CampaignState.OPEN, false],
      [VaccineType.HPV, CampaignState.PRE_OPEN, false],
    ])(
      `should return showHowToGet Section as: %s, campaigns: %s, expected: %s`,
      async (vaccineType, campaignState, expected) => {
        const actual = shouldShowHowToGetExpander(vaccineType, campaignState);
        expect(actual).toBe(expected);
      },
    );
  });
});
