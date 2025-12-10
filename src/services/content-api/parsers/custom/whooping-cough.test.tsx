import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { buildFilteredContentForWhoopingCoughVaccine } from "@src/services/content-api/parsers/custom/whooping-cough";

const apiResponse = JSON.stringify({
  mainEntityOfPage: [
    { hasPart: [{ text: "Whooping Cough Vaccine Lead Paragraph (overview)" }] },
    { hasPart: [{ text: "<p>What the vaccine is for paragraph</p>" }] },
    { hasPart: [{ text: "<p>Who the vaccine is for paragraph</p>" }] },
    { hasPart: [{ text: "paragraph 3" }] },
    { hasPart: [{ text: "paragraph 4" }] },
    { hasPart: [{ text: "paragraph 5" }] },
    { hasPart: [{ text: "<p>Side effects of the vaccine paragraph</p>" }] },
    { hasPart: [{ text: "paragraph 7" }] },
    { hasPart: [{ text: "paragraph 8" }] },
    { hasPart: [{ text: "paragraph 9" }] },
    { hasPart: [{ text: "paragraph 10" }] },
    { hasPart: [{ text: "paragraph 11" }] },
    { hasPart: [{ text: "paragraph 12" }] },
    { hasPart: [{ text: "paragraph 13" }] },
    { hasPart: [{ text: "<p>How to get the vaccine paragraph</p>" }] },
    { hasPart: [{ text: "paragraph 15" }] },
  ],
});

describe("getFilteredContentForWhoopingCoughVaccine", () => {
  it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
    const expected = { overview: { content: "Whooping Cough Vaccine Lead Paragraph (overview)", containsHtml: true } };

    const pageCopy = await buildFilteredContentForWhoopingCoughVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return all parts for whatVaccineIsFor section", async () => {
    const expected = {
      whatVaccineIsFor: {
        headline: "What the vaccine is for",
        subsections: [
          {
            type: "simpleElement",
            headline: "",
            name: "markdown",
            text: "<p>What the vaccine is for paragraph</p>",
          },
        ],
      },
    };

    const pageCopy = await buildFilteredContentForWhoopingCoughVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return all parts for whoVaccineIsFor section", async () => {
    const expected = {
      whoVaccineIsFor: {
        headline: "Who should have the vaccine",
        subsections: [
          {
            type: "simpleElement",
            headline: "",
            name: "markdown",
            text: "<p>Who the vaccine is for paragraph</p>",
          },
        ],
      },
    };

    const pageCopy = await buildFilteredContentForWhoopingCoughVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return all parts for howToGetVaccine section", async () => {
    const expected = {
      howToGetVaccine: {
        headline: "How to get the vaccine",
        subsections: [
          {
            type: "simpleElement",
            headline: "",
            name: "markdown",
            text: "<p>How to get the vaccine paragraph</p>",
          },
        ],
      },
    };

    const pageCopy = await buildFilteredContentForWhoopingCoughVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return all parts for vaccineSideEffects section", async () => {
    const expected = {
      vaccineSideEffects: {
        headline: "Side effects of the vaccine",
        subsections: [
          {
            type: "simpleElement",
            headline: "",
            name: "markdown",
            text: "<p>Side effects of the vaccine paragraph</p>",
          },
        ],
      },
    };

    const pageCopy = await buildFilteredContentForWhoopingCoughVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should include nhs webpage link to vaccine info", async () => {
    const expected = {
      webpageLink: VaccineInfo[VaccineType.WHOOPING_COUGH].nhsWebpageLink,
    };

    const pageCopy = await buildFilteredContentForWhoopingCoughVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
