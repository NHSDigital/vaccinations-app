import { getFilteredContentForFluForChildrenVaccine } from "@src/services/content-api/parsers/custom/flu-for-children";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

describe("getFilteredContentForFluVaccine", () => {
  it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
    const expectedOverview = {
      overview: { content: "Generic Vaccine Lead Paragraph (overview)", containsHtml: false },
    };

    const pageCopy = getFilteredContentForFluForChildrenVaccine(JSON.stringify(genericVaccineContentAPIResponse));

    expect(pageCopy).toEqual(expect.objectContaining(expectedOverview));
  });

  it("should return warning callout", () => {
    const expected = {
      callout: {
        heading: "Booking service closed",
        content: "Flu vaccine bookings will reopen in autumn 2026",
        contentType: "string",
      },
    };

    const pageCopy = getFilteredContentForFluForChildrenVaccine(JSON.stringify(genericVaccineContentAPIResponse));

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return recommendation", () => {
    const expected = {
      recommendation: {
        heading: "The flu vaccine is recommended for children who:",
        content: "* are aged 2 or 3 years (born between September 2021 and 31 August 2023)",
      },
    };

    const pageCopy = getFilteredContentForFluForChildrenVaccine(JSON.stringify(genericVaccineContentAPIResponse));

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
