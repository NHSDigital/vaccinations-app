import { buildFilteredContentForFluVaccine } from "@src/services/content-api/parsers/custom/flu-vaccine";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({
  buildNbsUrlWithQueryParams: jest.fn(),
}));

describe("getFilteredContentForFluVaccine", () => {
  it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
    const expectedOverview = {
      overview: { content: "Generic Vaccine Lead Paragraph (overview)", containsHtml: false },
    };

    const pageCopy = await buildFilteredContentForFluVaccine(JSON.stringify(genericVaccineContentAPIResponse));

    expect(pageCopy).toEqual(expect.objectContaining(expectedOverview));
  });

  it("should return warning callout", async () => {
    const expected = {
      callout: {
        heading: "Booking service closed",
        content: "Flu vaccine bookings will reopen in autumn 2026",
        contentType: "string",
      },
    };

    const pageCopy = await buildFilteredContentForFluVaccine(JSON.stringify(genericVaccineContentAPIResponse));

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return recommendation", async () => {
    const expected = {
      recommendation: {
        heading: "The flu vaccine is recommended if you:",
        content:
          "* are aged 65 or older (including those who will be 65 by 31 March 2026\n" +
          "* have certain long-term health conditions\n" +
          "* are pregnant\n" +
          "* live in a care home\n" +
          "* are the main carer for an older or disabled person, or receive a carer's allowance\n" +
          "* live with someone who has a weakened immune system",
      },
    };

    const pageCopy = await buildFilteredContentForFluVaccine(JSON.stringify(genericVaccineContentAPIResponse));

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
