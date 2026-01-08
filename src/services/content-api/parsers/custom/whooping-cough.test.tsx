import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { buildFilteredContentForWhoopingCoughVaccine } from "@src/services/content-api/parsers/custom/whooping-cough";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({}));

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
        headline: "Why are pregnant women offered the vaccine?",
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
        headline: "Is the vaccine safe in pregnancy?",
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

  it("should return all parts for howToGetVaccine section, without booking links", async () => {
    const actual = JSON.stringify({
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
        {
          hasPart: [
            {
              text: '<p><a href="https://www.nhs.uk/nhs-services/vaccination-and-booking-services/book-flu-vaccination/">book a free vaccination appointment at a pharmacy online</a> or in the <a href="https://www.nhs.uk/nhs-app/">NHS App</a></p>',
            },
          ],
        },
        { hasPart: [{ text: "paragraph 15" }] },
      ],
    });
    const expected = {
      howToGetVaccine: {
        headline: "How to get the vaccine",
        subsections: [
          {
            type: "simpleElement",
            headline: "",
            name: "markdown",
            text: "<p>book a free vaccination appointment at a pharmacy online or in the NHS App</p>",
          },
        ],
      },
    };
    const pageCopy = await buildFilteredContentForWhoopingCoughVaccine(actual);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
