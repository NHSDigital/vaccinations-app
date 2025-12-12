import { buildFilteredContentForCovid19Vaccine } from "@src/services/content-api/parsers/custom/covid-19";
import { ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import { buildNbsUrl } from "@src/services/nbs/nbs-service";
import { Campaigns } from "@src/utils/campaigns/types";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";
import { headers } from "next/headers";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({ buildNbsUrl: jest.fn() }));
jest.mock("next/headers");

describe("buildFilteredContentForCovid19Vaccine", () => {
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

    (buildNbsUrl as jest.Mock).mockResolvedValue(new URL("https://test-nbs-url.example.com/sausages"));

    const mockHeaders = {
      get: jest.fn(),
    };
    (headers as jest.Mock).mockResolvedValue(mockHeaders);
  });

  jest.useFakeTimers();

  it("should return standard vaccine content and additional content for COVID-19 vaccine", async () => {
    jest.setSystemTime(new Date("2025-10-01"));

    const pageCopyForCovid19Vaccine = await buildFilteredContentForCovid19Vaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopyForCovid19Vaccine.overview).toBeDefined();
    expect(pageCopyForCovid19Vaccine.whatVaccineIsFor).toBeDefined();
    expect(pageCopyForCovid19Vaccine.whoVaccineIsFor).toBeDefined();
    expect(pageCopyForCovid19Vaccine.howToGetVaccine).toBeDefined();
    expect(pageCopyForCovid19Vaccine.vaccineSideEffects).toBeDefined();
    expect(pageCopyForCovid19Vaccine.webpageLink).toBeDefined();

    // Additional COVID-19 vaccine content
    expect(pageCopyForCovid19Vaccine.callout?.heading).toEqual("Booking service closed");
    expect(pageCopyForCovid19Vaccine.recommendation?.heading).toEqual("The COVID-19 vaccine is recommended if you:");
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
