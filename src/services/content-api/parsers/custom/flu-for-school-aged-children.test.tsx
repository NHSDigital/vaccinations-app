import { getFilteredContentForFluForSchoolAgedChildrenVaccine } from "@src/services/content-api/parsers/custom/flu-for-school-aged-children";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

describe("getFilteredContentForFluVaccine", () => {
  it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
    const expectedOverview = {
      overview: { content: "Generic Vaccine Lead Paragraph (overview)", containsHtml: false },
    };

    const pageCopy = getFilteredContentForFluForSchoolAgedChildrenVaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expectedOverview));
  });

  it("should set the standard vaccine content", async () => {
    const pageCopy = getFilteredContentForFluForSchoolAgedChildrenVaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy.whatVaccineIsFor).toBeDefined();
    expect(pageCopy.whoVaccineIsFor).toBeDefined();
    expect(pageCopy.howToGetVaccine).toBeDefined();
    expect(pageCopy.vaccineSideEffects).toBeDefined();
    expect(pageCopy.webpageLink).toBeDefined();
  });

  it("should return recommendation", () => {
    const expected = {
      recommendation: {
        heading: "The flu vaccine is recommended for children who:",
        content: "* are of school age (Reception to Year 1)",
      },
    };

    const pageCopy = getFilteredContentForFluForSchoolAgedChildrenVaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
