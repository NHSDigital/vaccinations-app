import { MoreInformation } from "@src/app/_components/content/MoreInformation";
import { VaccineType } from "@src/models/vaccine";
import { Campaigns } from "@src/utils/campaigns/types";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { mockStyledContent, mockStyledContentWithoutWhatSection } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";













jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/config");

describe("MoreInformation component for COVID", () => {
  const mockedConfig = config as ConfigMock;
  const covid19VaccineType: VaccineType = VaccineType.COVID_19;
  const campaigns = new Campaigns({});

  beforeEach(() => {
    const defaultConfig = configBuilder().withCampaigns(campaigns).build();
    Object.assign(mockedConfig, defaultConfig);
  });

  it("should not show how-to-get expander section for COVID-19 vaccine when campaign is active", async () => {
    const activeCampaignSpy = jest.spyOn(campaigns, "isActive").mockReturnValue(true);

    render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: covid19VaccineType }));

    // COVID-19 vaccine content (active campaign)
    expectExpanderBlockToNotBePresent("How to get the vaccine", "How Section styled component");
    expect(activeCampaignSpy).toHaveBeenCalledWith(covid19VaccineType, expect.any(Date));
  });

  it("should show how-to-get expander section for COVID-19 vaccine when campaign is inactive", async () => {
    const inactiveCampaignSpy = jest.spyOn(campaigns, "isActive").mockReturnValue(false);

    render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: covid19VaccineType }));

    // COVID-19 vaccine content (closed campaign)
    expectExpanderBlockToBePresent("How to get the vaccine", "How Section styled component");
    expect(inactiveCampaignSpy).toHaveBeenCalledWith(covid19VaccineType, expect.any(Date));
  });
});

describe("MoreInformation component ", () => {
  const mockedConfig = config as ConfigMock;

  beforeEach(() => {
    const defaultConfig = configBuilder()
      .withCampaigns(
        Campaigns.fromJson(
          JSON.stringify({
            COVID_19: [
              { start: "2025-11-01T09:00:00Z", end: "2026-01-31T09:00:00Z" },
              { start: "2026-11-01T09:00:00Z", end: "2027-01-31T09:00:00Z" },
            ],
          }),
        )!,
      )
      .build();
    Object.assign(mockedConfig, defaultConfig);
  });

  describe("moreInformationHeadersFromContentApi false", () => {
    it("should display whatItIsFor expander block", async () => {
      const vaccineType = VaccineType.RSV;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      expectExpanderBlockToBePresent("What the vaccine is for", "What Section styled component");
    });

    it("should display whoVaccineIsFor expander block", async () => {
      const vaccineType = VaccineType.RSV;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      expectExpanderBlockToBePresent("Who should have the vaccine", "Who Section styled component");
    });

    it("should display howToGet expander block", async () => {
      const vaccineType = VaccineType.TD_IPV_3_IN_1;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      expectExpanderBlockToBePresent("How to get the vaccine", "How Section styled component");
    });

    it("should display vaccineSideEffects expander block", async () => {
      const vaccineType = VaccineType.RSV;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      expectExpanderBlockToBePresent("Side effects of the vaccine", "Side effects section styled component");
    });
  });

  describe("moreInformationHeadersFromContentApi true", () => {
    it("should display whatItIsFor expander block", async () => {
      const vaccineType = VaccineType.FLU_IN_PREGNANCY;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      expectExpanderBlockToBePresent("what-heading", "What Section styled component");
    });

    it("should display whoVaccineIsFor expander block", async () => {
      const vaccineType = VaccineType.FLU_IN_PREGNANCY;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      expectExpanderBlockToBePresent("who-heading", "Who Section styled component");
    });

    it("should display howToGet expander block", async () => {
      const vaccineType = VaccineType.FLU_IN_PREGNANCY;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      expectExpanderBlockToBePresent("how-heading", "How Section styled component");
    });

    it("should display vaccineSideEffects expander block", async () => {
      const vaccineType = VaccineType.FLU_IN_PREGNANCY;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      expectExpanderBlockToBePresent("side-effects-heading", "Side effects section styled component");
    });
  });

  describe("MoreInformation", () => {
    it("should not include 'how to get' section for RSV_PREGNANCY ", async () => {
      const vaccineType = VaccineType.RSV_PREGNANCY;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      const heading: HTMLElement | null = screen.queryByText("How to get the vaccine");

      expect(heading).not.toBeInTheDocument();
    });

    it("should not include 'how to get' section for RSV ", async () => {
      const vaccineType = VaccineType.RSV;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      const heading: HTMLElement | null = screen.queryByText("How to get the vaccine");

      expect(heading).not.toBeInTheDocument();
    });

    it("should display webpage link to more information about vaccine", async () => {
      const vaccineType = VaccineType.RSV;
      render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: vaccineType }));

      const webpageLink: HTMLElement = screen.getByRole("link", {
        name: "Find out more about the RSV vaccine",
      });

      expect(webpageLink).toBeInTheDocument();
      expect(webpageLink).toHaveAttribute("href", "https://test.example.com/");
      expect(webpageLink).toHaveAttribute("target", "_blank");
    });

    it("should not display whatItIsFor section if undefined in content", async () => {
      const vaccineType = VaccineType.RSV;
      render(
        await MoreInformation({ styledVaccineContent: mockStyledContentWithoutWhatSection, vaccineType: vaccineType }),
      );

      const whatItIsForHeading: HTMLElement | null = screen.queryByText("What the vaccine is for");
      const whatItIsForContent: HTMLElement | null = screen.queryByText("What Section styled component");

      expect(whatItIsForHeading).not.toBeInTheDocument();
      expect(whatItIsForContent).not.toBeInTheDocument();
    });

    it("should display whoVaccineIsFor section even if whatItIsFor is undefined in content", async () => {
      const vaccineType = VaccineType.RSV;
      render(
        await MoreInformation({ styledVaccineContent: mockStyledContentWithoutWhatSection, vaccineType: vaccineType }),
      );

      expectExpanderBlockToBePresent("Who should have the vaccine", "Who Section styled component");
    });
  });
});

const expectExpanderBlockToBePresent = (expanderHeading: string, expanderContent: string) => {
  const heading: HTMLElement = screen.getByText(expanderHeading);
  const content: HTMLElement = screen.getByText(expanderContent);

  expect(heading).toBeInTheDocument();
  expect(content).toBeInTheDocument();
};

const expectExpanderBlockToNotBePresent = (expanderHeading: string, expanderContent: string) => {
  expect(screen.queryByText(expanderHeading)).toBeNull();
  expect(screen.queryByText(expanderContent)).toBeNull();
};
