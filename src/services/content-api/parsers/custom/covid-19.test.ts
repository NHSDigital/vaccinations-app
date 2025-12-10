import { buildFilteredContentForCovid19Vaccine } from "@src/services/content-api/parsers/custom/covid-19";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("buildFilteredContentForCovid19Vaccine", () => {
  process.env.CAMPAIGNS = JSON.stringify({
    COVID_19: [
      { start: "20251101", end: "20260131" },
      { start: "20261101", end: "20270131" },
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

  it("should return a callout when no campaign is active", async () => {
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
  });

  it("should not return a callout when no campaign is active", async () => {
    // Given
    jest.useFakeTimers().setSystemTime(new Date("2025-12-01"));

    // When
    const pageCopy = await buildFilteredContentForCovid19Vaccine(JSON.stringify(genericVaccineContentAPIResponse));

    // Then
    expect(pageCopy.callout).toBeUndefined();
  });
});
