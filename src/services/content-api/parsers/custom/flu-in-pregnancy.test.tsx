import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { buildFilteredContentForFluInPregnancyVaccine } from "@src/services/content-api/parsers/custom/flu-in-pregnancy";
import { ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import { buildNbsUrl } from "@src/services/nbs/nbs-service";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({ buildNbsUrl: jest.fn() }));

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

describe("buildFilteredContentForFluInPregnancyVaccine", () => {
  beforeEach(() => {
    (buildNbsUrl as jest.Mock).mockResolvedValue(new URL("https://test-nbs-url.example.com/sausages"));
  });
  it("should return all parts for whatVaccineIsFor section", async () => {
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

    const pageCopy = await buildFilteredContentForFluInPregnancyVaccine(apiResponse);

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
            text: "<p>Is the vaccine safe in pregnancy paragraph</p>",
          },
        ],
      },
    };

    const pageCopy = await buildFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return all parts for howToGetVaccine section, without booking links", async () => {
    const actual = JSON.stringify({
      mainEntityOfPage: [
        { hasPart: [{ text: "Flu in Pregnancy Vaccine Lead Paragraph (overview)" }] },
        { hasPart: [{ text: "<p>Why pregnant women are offered the vaccine paragraph</p>" }] },
        { hasPart: [{ text: "<p>Is the vaccine safe in pregnancy paragraph</p>" }] },
        { hasPart: [{ text: "<p>When should I have the vaccine paragraph</p>" }] },
        {
          hasPart: [
            {
              text: '<p><a href="https://www.nhs.uk/nhs-services/vaccination-and-booking-services/book-flu-vaccination/">book a free NHS flu vaccination appointment at a pharmacy online</a> or in the <a href="https://www.nhs.uk/nhs-app/">NHS App</a></p>',
            },
          ],
        },
        { hasPart: [{ text: "paragraph 5" }] },
        { hasPart: [{ text: "Flu in Pregnancy Vaccine Lead Paragraph (overview)" }] },
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
            text: "<p>book a free NHS flu vaccination appointment at a pharmacy online or in the NHS App</p>",
          },
        ],
      },
    };

    const pageCopy = await buildFilteredContentForFluInPregnancyVaccine(actual);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return all parts for vaccineSideEffects section", async () => {
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

    const pageCopy = await buildFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should include nhs webpage link to vaccine info", async () => {
    const expected = {
      webpageLink: VaccineInfo[VaccineType.FLU_IN_PREGNANCY].nhsWebpageLink,
    };

    const pageCopy = await buildFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return warning callout", async () => {
    const expected = {
      callout: {
        heading: "Booking service closed",
        content: "Flu vaccine bookings will reopen in autumn 2026",
        contentType: "string",
      },
    };

    const pageCopy = await buildFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return recommendation", async () => {
    const expected = {
      recommendation: {
        heading: "The flu vaccine is recommended:",
        content: "* if you are pregnant\n* whatever stage of pregnancy you're at\n\nIt's free on the NHS.",
      },
    };

    const pageCopy = await buildFilteredContentForFluInPregnancyVaccine(apiResponse);

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return callout and actions", async () => {
    const expected = {
      actions: [
        {
          type: ActionDisplayType.infotext,
          content: ("## If this applied to you\n\n### Get vaccinated at your GP surgery or maternity service\n\n" +
            "Contact your GP surgery or maternity service (if your maternity service offers the flu vaccine) to book an appointment.") as Content,
        },
        {
          type: ActionDisplayType.buttonWithInfo,
          content: "### Book an appointment online" as Content,
          button: {
            label: "Continue to booking" as Label,
            url: new URL("https://test-nbs-url.example.com/sausages") as ButtonUrl,
          },
        },
        {
          type: ActionDisplayType.actionLinkWithInfo,
          content: ("## Get vaccinated without an appointment\n\n" +
            "You can find a pharmacy that offers walk-in appointments without booking.") as Content,
          button: {
            label: "Find a pharmacy where you can get a free flu vaccination" as Label,
            url: new URL(
              "https://www.nhs.uk/nhs-services/vaccination-and-booking-services/find-a-pharmacy-that-offers-free-flu-vaccination/",
            ) as ButtonUrl,
          },
        },
      ],
    };

    const pageCopy = await buildFilteredContentForFluInPregnancyVaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
