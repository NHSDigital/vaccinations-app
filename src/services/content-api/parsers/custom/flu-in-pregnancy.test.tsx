import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { buildFilteredContentForFluInPregnancyVaccine } from "@src/services/content-api/parsers/custom/flu-in-pregnancy";

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

    const pageCopy = buildFilteredContentForFluInPregnancyVaccine(apiResponse);

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

    const pageCopy = buildFilteredContentForFluInPregnancyVaccine(apiResponse);

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

    const pageCopy = buildFilteredContentForFluInPregnancyVaccine(apiResponse);

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

    const pageCopy = buildFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should include nhs webpage link to vaccine info", () => {
    const expected = {
      webpageLink: VaccineInfo[VaccineType.FLU_IN_PREGNANCY].nhsWebpageLink,
    };

    const pageCopy = buildFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return warning callout", () => {
    const expected = {
      callout: {
        heading: "Booking service closed",
        content: "Flu vaccine bookings will reopen in autumn 2026",
        contentType: "string",
      },
    };

    const pageCopy = buildFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return recommendation", () => {
    const expected = {
      recommendation: {
        heading: "The flu vaccine is recommended:",
        content: "* if you are pregnant\n* whatever stage of pregnancy you're at\n\nIt's free on the NHS.",
      },
    };

    const pageCopy = buildFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
