import { buildFilteredContentForFluVaccine } from "@src/services/content-api/parsers/custom/flu-vaccine";
import { ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import { buildNbsUrl } from "@src/services/nbs/nbs-service";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({ buildNbsUrl: jest.fn() }));

describe("getFilteredContentForFluVaccine", () => {
  beforeEach(() => {
    (buildNbsUrl as jest.Mock).mockResolvedValue(new URL("https://test-nbs-url.example.com/sausages"));
  });

  it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
    const expectedOverview = {
      overview: { content: "Generic Vaccine Lead Paragraph (overview)", containsHtml: false },
    };

    const pageCopy = await buildFilteredContentForFluVaccine(JSON.stringify(genericVaccineContentAPIResponse));

    expect(pageCopy).toEqual(expect.objectContaining(expectedOverview));
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

  it("should return callout and actions", async () => {
    const expected = {
      callout: {
        heading: "Booking service closed",
        content: "Flu vaccine bookings will reopen in autumn 2026",
        contentType: "string",
      },
      actions: [
        {
          type: ActionDisplayType.infotext,
          content: ("## If this applies to you\n\n### Get vaccinated at your GP surgery\n\n" +
            "Contact your GP surgery to book an appointment.") as Content,
        },
        {
          type: ActionDisplayType.buttonWithInfo,
          content: "### Book an appointment online at a pharmacy" as Content,
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

    const pageCopy = await buildFilteredContentForFluVaccine(JSON.stringify(genericVaccineContentAPIResponse));

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
