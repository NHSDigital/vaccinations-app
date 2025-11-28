import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { getFilteredContentForFluInPregnancyVaccine } from "@src/services/content-api/parsers/custom/flu-in-pregnancy";

const apiResponse = JSON.stringify({
  mainEntityOfPage: [
    { hasPart: [{ text: "Flu in Pregnancy Vaccine Lead Paragraph (overview)" }] },
    { hasPart: [{ text: "<p>Why pregnant women are offered the vaccine paragraph</p>" }] },
    { hasPart: [{ text: "<p>Is the vaccine safe in pregnancy paragraph</p>" }] },
    { hasPart: [{ text: "<p>When should I have the vaccine paragraph</p>" }] },
    { hasPart: [{ text: "<p>How to get the vaccine paragraph</p>" }] },
    { hasPart: [{ text: "paragraph 5" }] },
  ],
});

describe("getFilteredContentForFluInPregnancyVaccine", () => {
  it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
    const expected = {
      overview: { content: "Flu in Pregnancy Vaccine Lead Paragraph (overview)", containsHtml: true },
    };

    const pageCopy = getFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return all parts for whatVaccineIsFor section", () => {
    const expected = {
      whatVaccineIsFor: {
        headline: "Why pregnant women are offered the vaccine",
        subsections: [
          {
            type: "simpleElement",
            headline: "",
            name: "markdown",
            text: "<p>Why pregnant women are offered the vaccine paragraph</p>",
          },
        ],
      },
    };

    const pageCopy = getFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return all parts for whoVaccineIsFor section", () => {
    const expected = {
      whoVaccineIsFor: {
        headline: "Is the vaccine safe in pregnancy?",
        subsections: [
          {
            type: "simpleElement",
            headline: "",
            name: "markdown",
            text: "<p>Is the vaccine safe in pregnancy paragraph</p>",
          },
        ],
      },
    };

    const pageCopy = getFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return all parts for howToGetVaccine section", () => {
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

    const pageCopy = getFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return all parts for vaccineSideEffects section", () => {
    const expected = {
      vaccineSideEffects: {
        headline: "When should I have the vaccine?",
        subsections: [
          {
            type: "simpleElement",
            headline: "",
            name: "markdown",
            text: "<p>When should I have the vaccine paragraph</p>",
          },
        ],
      },
    };

    const pageCopy = getFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should include nhs webpage link to vaccine info", () => {
    const expected = {
      webpageLink: VaccineInfo[VaccineType.WHOOPING_COUGH].nhsWebpageLink,
    };

    const pageCopy = getFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
