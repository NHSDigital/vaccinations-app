import { buildFilteredContentForFluForSchoolAgedChildrenVaccine } from "@src/services/content-api/parsers/custom/flu-for-school-aged-children";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";
import { cloneDeep } from "es-toolkit";

const childFluVaccineContentAPIResponse = cloneDeep(genericVaccineContentAPIResponse);

const expanderGroup = [
  {
    "@type": "WebPageElement",
    position: 1,
    name: "Expander Group",
    identifier: "20",
    mainEntity: [
      {
        position: 1,
        "@type": "WebPageElement",
        name: "Expander",
        subjectOf: "School-aged children (Reception to Year 11)",
        identifier: "18",
        mainEntity: "<p>School age how-to-get</p>",
      },
    ],
  },
];
childFluVaccineContentAPIResponse.mainEntityOfPage.unshift({
  "@type": "WebPageElement",
  position: 1,
  identifier: "20",
  name: "Expander Group",
  hasHealthAspect: "https://schema.org/GettingAccessHealthAspect",
  headline: "How to get the children's flu vaccine",
  mainEntityOfPage: expanderGroup,
  hasPart: expanderGroup,
});

describe("buildFilteredContentForFluForSchoolAgedChildrenVaccine", () => {
  it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
    const expectedOverview = {
      overview: { content: "Generic Vaccine Lead Paragraph (overview)", containsHtml: false },
    };

    const pageCopy = buildFilteredContentForFluForSchoolAgedChildrenVaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expectedOverview));
  });

  it("should set the standard vaccine content", async () => {
    const pageCopy = buildFilteredContentForFluForSchoolAgedChildrenVaccine(
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

    const pageCopy = buildFilteredContentForFluForSchoolAgedChildrenVaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return overviewConclusion", () => {
    const expected = {
      overviewConclusion: {
        content: '<h2 class="nhsuk-heading-m">How to get the vaccine</h2><p>School age how-to-get</p>',
        containsHtml: true,
      },
    };

    const pageCopy = buildFilteredContentForFluForSchoolAgedChildrenVaccine(
      JSON.stringify(childFluVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
