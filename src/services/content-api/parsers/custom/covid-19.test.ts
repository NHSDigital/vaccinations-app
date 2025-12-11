import { buildFilteredContentForCovid19Vaccine } from "@src/services/content-api/parsers/custom/covid-19";
import { ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("buildFilteredContentForCovid19Vaccine", () => {
  process.env.CAMPAIGNS = JSON.stringify({
    COVID_19: [
      { start: "2025-11-01T09:00:00Z", end: "2026-01-31T09:00:00Z" },
      { start: "2026-11-01T09:00:00Z", end: "2027-01-31T09:00:00Z" },
    ],
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
          type: ActionDisplayType.actionLinkWithInfo,
          content: [
            "## Get vaccinated without an appointment",
            "You can find a walk-in COVID-19 vaccination site to get a vaccination without an appointment. You do not need to be registered with a GP.",
          ].join("\n\n") as Content,
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
});
