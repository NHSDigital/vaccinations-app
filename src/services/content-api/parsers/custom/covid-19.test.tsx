import { buildFilteredContentForCovid19Vaccine } from "@src/services/content-api/parsers/custom/covid-19";
import { ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import { buildNbsUrl } from "@src/services/nbs/nbs-service";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({ buildNbsUrl: jest.fn() }));

describe("buildFilteredContentForCovid19Vaccine", () => {
  beforeEach(() => {
    (buildNbsUrl as jest.Mock).mockResolvedValue(new URL("https://test-nbs-url.example.com/sausages"));
  });

  it("should return standard vaccine content and additional content for COVID-19 vaccine", async () => {
    const pageCopyForCovid19Vaccine = await buildFilteredContentForCovid19Vaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopyForCovid19Vaccine.overview).toBeDefined();
    expect(pageCopyForCovid19Vaccine.whatVaccineIsFor).toBeDefined();
    expect(pageCopyForCovid19Vaccine.whoVaccineIsFor).toBeDefined();
    expect(pageCopyForCovid19Vaccine.howToGetVaccine).toBeDefined();
    expect(pageCopyForCovid19Vaccine.vaccineSideEffects).toBeDefined();
    expect(pageCopyForCovid19Vaccine.webpageLink).toBeDefined();

    // Additional COVID-19 vaccine content
    expect(pageCopyForCovid19Vaccine.callout?.heading).toEqual("Booking service closed");
    expect(pageCopyForCovid19Vaccine.recommendation?.heading).toEqual("The COVID-19 vaccine is recommended if you:");
  });

  it("should return callout and actions", async () => {
    const expected = {
      callout: {
        heading: "Booking service closed",
        content:
          "You can no longer book a COVID-19 vaccination using this online service\n\n" +
          "Bookings can also no longer be made through the 119 service.\n\n" +
          "COVID-19 vaccinations will be available again in spring.",
        contentType: "markdown",
      },
      actions: [
        {
          type: ActionDisplayType.buttonWithInfo,
          content: "## If this applies to you\n\n### Book an appointment online at a pharmacy" as Content,
          button: {
            label: "Continue to booking" as Label,
            url: new URL("https://test-nbs-url.example.com/sausages") as ButtonUrl,
          },
        },
        {
          type: ActionDisplayType.actionLinkWithInfo,
          content: ("### Get vaccinated without an appointment\n\n" +
            "You can find a walk-in COVID-19 vaccination site to get a vaccination without an appointment. " +
            "You do not need to be registered with a GP.") as Content,
          button: {
            label: "Find a walk-in COVID-19 vaccination site" as Label,
            url: new URL(
              "https://www.nhs.uk/nhs-services/vaccination-and-booking-services/find-a-walk-in-covid-19-vaccination-site/",
            ) as ButtonUrl,
          },
        },
      ],
    };

    const pageCopy = await buildFilteredContentForCovid19Vaccine(JSON.stringify(genericVaccineContentAPIResponse));

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
