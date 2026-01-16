import { buildFilteredContentForFluForChildrenVaccine } from "@src/services/content-api/parsers/custom/flu-for-children";
import { ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import { buildNbsUrl } from "@src/services/nbs/nbs-service";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({ buildNbsUrl: jest.fn() }));

describe("buildFilteredContentForFluForChildrenVaccine", () => {
  beforeEach(() => {
    (buildNbsUrl as jest.Mock).mockResolvedValue(new URL("https://test-nbs-url.example.com/sausages"));
  });

  it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
    const expectedOverview = {
      overview: { content: "Generic Vaccine Lead Paragraph (overview)", containsHtml: false },
    };

    const pageCopy = await buildFilteredContentForFluForChildrenVaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expectedOverview));
  });

  it("should return warning callout", async () => {
    const expected = {
      callout: {
        heading: "Booking service closed",
        content: "Flu vaccinations will be available in autumn 2026",
        contentType: "string",
      },
    };

    const pageCopy = await buildFilteredContentForFluForChildrenVaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return recommendation", async () => {
    const expected = {
      recommendation: {
        heading: "The flu vaccine is recommended for children who:",
        content: "* are aged 2 or 3 years (born between September 2021 and 31 August 2023)",
      },
    };

    const pageCopy = await buildFilteredContentForFluForChildrenVaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return callout and actions", async () => {
    const expected = {
      actions: [
        {
          type: ActionDisplayType.infotext,
          content: ("## If this applies to your child\n\n### Get vaccinated at your GP surgery\n\n" +
            "Contact your GP surgery to book an appointment.") as Content,
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
          content: ("### Get vaccinated without an appointment\n\n" +
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

    const pageCopy = await buildFilteredContentForFluForChildrenVaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
