import { buildFilteredContentForCovid19Vaccine } from "@src/services/content-api/parsers/custom/covid-19";
import { VaccinePageContent } from "@src/services/content-api/types";
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
    expect(pageCopyForCovid19Vaccine.callout?.heading).toEqual("Service closed");
    expect(pageCopyForCovid19Vaccine.recommendation?.heading).toEqual("The COVID-19 vaccine is recommended if you:");
    expect(pageCopyForCovid19Vaccine.extraDosesSchedule?.headline).toEqual("Extra doses of the vaccine");
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

    const openActions = [
      {
        type: ActionDisplayType.nbsAuthLinkButtonWithInfo,
        content: [
          "## If this applies to you",
          "### Book an appointment online",
          "You can book an appointment online at some pharmacies, GP surgeries and vaccination centres.",
        ].join("\n\n") as Content,
        button: {
          label: "Book, cancel or change an appointment" as Label,
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
      {
        type: ActionDisplayType.infotext,
        content: ["### Get vaccinated at your GP surgery", "Contact your GP surgery to book an appointment."].join(
          "\n\n",
        ) as Content,
        button: undefined,
      },
    ];

    const expected = {
      callout: {
        heading: "Service closed",
        content: "COVID-19 vaccinations will be available in spring 2026.",
        contentType: "markdown",
      },
      preOpenActions: preOpenActionsValues,
      actions: openActions,
    };

    const pageCopy: VaccinePageContent = await buildFilteredContentForCovid19Vaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopy).toEqual(expect.objectContaining(expected));
  });

  it("should return extra doses information from UsageOrScheduleHealthAspect", async () => {
    const expectedExtraDosesHeadline = "Extra doses of the vaccine";
    const expectedUsageOrScheduleSubsections = [
      {
        type: "simpleElement",
        headline: "",
        name: "markdown",
        text: "<p>The generic vaccine is given as an injection.</p><p>Most people only need 1 dose of the generic vaccine.</p><h3>Extra doses of the Generic vaccine</h3><p>Some people need an extra dose of the generic vaccine. For example.</p><p>Your GP or specialist will assess your risk and tell you if you need an extra dose of the vaccine.</p>",
      },
    ];

    const pageCopyForCovid19Vaccine = await buildFilteredContentForCovid19Vaccine(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    expect(pageCopyForCovid19Vaccine.extraDosesSchedule?.headline).toEqual(expectedExtraDosesHeadline);
    expect(pageCopyForCovid19Vaccine.extraDosesSchedule?.subsections).toEqual(expectedUsageOrScheduleSubsections);
  });
});
