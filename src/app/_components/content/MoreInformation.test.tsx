import { MoreInformation } from "@src/app/_components/content/MoreInformation";
import { VaccineType } from "@src/models/vaccine";
import { ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import { Campaigns } from "@src/utils/campaigns/types";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import {
  genericVaccineContentAPIResponse,
  mockStyledContent,
  mockStyledContentWithoutWhatSection,
} from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import { headers } from "next/headers";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/config");
jest.mock("next/headers");

describe("MoreInformation for COVID", () => {
  const mockedConfig = config as ConfigMock;
  const covid19VaccineType: VaccineType = VaccineType.COVID_19;

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

    const mockHeaders = {
      get: jest.fn(),
    };
    (headers as jest.Mock).mockResolvedValue(mockHeaders);
  });

  jest.useFakeTimers();

  it("should return standard vaccine content and additional content for COVID-19 vaccine", async () => {
    jest.setSystemTime(new Date("2025-10-01"));

    render(await MoreInformation({ styledVaccineContent: mockStyledContent, vaccineType: covid19VaccineType }));

    // COVID-19 vaccine content (closed campaign)
    expectExpanderBlockToBePresent("How to get the vaccine", "How Section styled component");
    expectExpanderBlockToBePresent("Callout Heading", "");
    // expect(pageCopyForCovid19Vaccine.recommendation?.heading).toEqual("The COVID-19 vaccine is recommended if you:");
  });

  it("should return a callout but no actions when no campaign is active", async () => {
    // Given
    jest.setSystemTime(new Date("2025-10-01"));

    const expected = {
      callout: {
        heading: "Booking service closed",
        content:
          "You can no longer book a COVID-19 vaccination using this online service\n\n" +
          "Bookings can also no longer be made through the 119 service.\n\n" +
          "COVID-19 vaccinations will be available again in spring.",
        contentType: "markdown",
      },
    };

    // When
    const pageCopy = await buildFilteredContentForCovid19Vaccine(JSON.stringify(genericVaccineContentAPIResponse));

    // Then
    expect(pageCopy).toEqual(expect.objectContaining(expected));
    expect(pageCopy.actions).toHaveLength(0);
  });

  it("should return actions but no callout when no campaign is active", async () => {
    // Given
    jest.setSystemTime(new Date("2025-12-01"));

    const expected = {
      actions: [
        {
          type: ActionDisplayType.buttonWithInfo,
          content: "## If this applies to you\n\n### Book an appointment online at a pharmacy" as Content,
          button: {
            label: "Continue to booking" as Label,
            url: new URL("https://test-nbs-url.example.com/sausages") as ButtonUrl,
          },
          delineator: true,
        },
        {
          type: ActionDisplayType.actionLinkWithInfo,
          content: ("## Get vaccinated without an appointment\n\n" +
            "You can find a walk-in COVID-19 vaccination site to get a vaccination without an appointment. " +
            "You do not need to be registered with a GP.") as Content,
          button: {
            label: "Find a walk-in COVID-19 vaccination site" as Label,
            url: new URL(
              "https://www.nhs.uk/nhs-services/vaccination-and-booking-services/find-a-walk-in-covid-19-vaccination-site/",
            ) as ButtonUrl,
          },
          delineator: false,
        },
      ],
    };

    // When
    const pageCopy = await buildFilteredContentForCovid19Vaccine(JSON.stringify(genericVaccineContentAPIResponse));

    // Then
    expect(pageCopy).toEqual(expect.objectContaining(expected));
    expect(pageCopy.callout).toBeUndefined();
  });

  describe("with x-e2e-datetime header set", () => {
    it("should return a callout but no actions when no campaign is active", async () => {
      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key === "x-e2e-datetime") return "2025-10-01T12:00:00Z";
          return null;
        }),
      };
      (headers as jest.Mock).mockResolvedValue(mockHeaders);

      const pageCopy = await buildFilteredContentForCovid19Vaccine(JSON.stringify(genericVaccineContentAPIResponse));

      expect(pageCopy.callout).not.toBeUndefined();
      expect(pageCopy.actions).toHaveLength(0);
    });

    it("should return actions but no callout when no campaign is active", async () => {
      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key === "x-e2e-datetime") return "2025-12-01T12:00:00Z";
          return null;
        }),
      };
      (headers as jest.Mock).mockResolvedValue(mockHeaders);

      const pageCopy = await buildFilteredContentForCovid19Vaccine(JSON.stringify(genericVaccineContentAPIResponse));

      expect(pageCopy.callout).toBeUndefined();
      expect(pageCopy.actions).not.toHaveLength(0);
    });
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
