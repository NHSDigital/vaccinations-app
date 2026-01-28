import { buildFilteredContentForCovid19Vaccine } from "@src/services/content-api/parsers/custom/covid-19";
import { VaccinePageContent } from "@src/services/content-api/types";
import { ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import { buildNbsUrl } from "@src/services/nbs/nbs-service";
import { genericVaccineContentAPIResponse, mockStyledContent } from "@test-data/content-api/data";

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
    expect(pageCopyForCovid19Vaccine.callout?.heading).toEqual("Service closed");
    expect(pageCopyForCovid19Vaccine.recommendation?.heading).toEqual("The COVID-19 vaccine is recommended if you:");
  });

  it("should return callout and actions", async () => {
    const preOpenActionsValues = [
      {
        type: ActionDisplayType.nbsAuthLinkButtonWithInfo,
        content: [
          "## If this applies to you",
          "You can book a COVID-19 vaccination appointment online now.",
          "Vaccination appointments will take place from 13 April.",
        ].join("\n\n") as Content,
        button: {
          label: "Book, cancel or change an appointment" as Label,
          url: new URL("https://test-nbs-url.example.com/sausages") as ButtonUrl,
        },
        moreInfo: [
          "From 13 April, you may also be able to get vaccinated at:",
          "* your GP surgery\n* a walk-in COVID-19 vaccination site\n* your care home (if you live in a care home)",
          "You do not need to wait for an invitation before booking an appointment.",
        ].join("\n\n") as Content,
      },
    ];
    const expected = {
      callout: {
        heading: "Service closed",
        content: "COVID-19 vaccinations will be available in spring 2026",
        contentType: "markdown",
      },
      preOpenActions: preOpenActionsValues,
      actions: mockStyledContent.actions,
    };

    const pageCopy: VaccinePageContent = await buildFilteredContentForCovid19Vaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });
});
