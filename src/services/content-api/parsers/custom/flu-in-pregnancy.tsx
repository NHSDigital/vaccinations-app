import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { removeExcludedHyperlinks } from "@src/services/content-api/parsers/content-filter-service";
import {
  ContentApiVaccineResponse,
  HeadingWithContent,
  HeadingWithTypedContent,
  VaccinePageContent,
  VaccinePageSection,
} from "@src/services/content-api/types";
import {
  Action,
  ActionDisplayType,
  ActionWithButton,
  ActionWithoutButton,
  ButtonUrl,
  Content,
  Label,
} from "@src/services/eligibility-api/types";
import { buildNbsUrl } from "@src/services/nbs/nbs-service";

export const buildFilteredContentForFluInPregnancyVaccine = async (apiContent: string): Promise<VaccinePageContent> => {
  const content: ContentApiVaccineResponse = JSON.parse(apiContent);

  const actions: Action[] = await _buildActions();

  const paragraphs: string[] = content.mainEntityOfPage
    .flatMap((entity) => entity.hasPart ?? [])
    .map((part) => part?.text)
    .filter((text): text is string => !!text);

  const whyOffered: VaccinePageSection = {
    headline: "Why are pregnant women offered the vaccine?",
    subsections: [{ type: "simpleElement", headline: "", text: paragraphs[1], name: "markdown" }],
  };
  const isItSafe: VaccinePageSection = {
    headline: "Is the vaccine safe in pregnancy?",
    subsections: [{ type: "simpleElement", headline: "", text: paragraphs[2], name: "markdown" }],
  };
  const howToGetVaccine: VaccinePageSection = {
    headline: "How to get the vaccine",
    subsections: removeExcludedHyperlinks([
      { type: "simpleElement", headline: "", text: paragraphs[4], name: "markdown" },
    ]),
  };
  const whenToGet: VaccinePageSection = {
    headline: "When should I have the vaccine?",
    subsections: [{ type: "simpleElement", headline: "", text: paragraphs[3], name: "markdown" }],
  };
  const webpageLink: URL = VaccineInfo[VaccineType.FLU_IN_PREGNANCY].nhsWebpageLink;
  const callout: HeadingWithTypedContent = {
    heading: "Service closed",
    content: "Flu vaccinations will be available in autumn 2026",
    contentType: "string",
  };
  const recommendation: HeadingWithContent = {
    heading: "The flu vaccine is recommended:",
    content: ["* if you are pregnant", "* whatever stage of pregnancy you're at", "", "It's free on the NHS."].join(
      "\n",
    ),
  };

  return {
    overview: undefined,
    whatVaccineIsFor: whyOffered,
    whoVaccineIsFor: isItSafe,
    howToGetVaccine,
    vaccineSideEffects: whenToGet,
    webpageLink,
    callout: callout,
    recommendation: recommendation,
    actions: actions,
  };
};

async function _buildActions(): Promise<Action[]> {
  const nbsURl = (await buildNbsUrl(VaccineType.FLU_IN_PREGNANCY)) as ButtonUrl;

  const bookWithGP: ActionWithoutButton = {
    type: ActionDisplayType.infotext,
    content: [
      "## If this applies to you",
      "### Get vaccinated at your GP surgery or maternity service",
      "Contact your GP surgery or maternity service (if your maternity service offers the flu vaccine) to book an appointment.",
    ].join("\n\n") as Content,
    button: undefined,
  };

  const nbsBooking: ActionWithButton = {
    type: ActionDisplayType.buttonWithInfo,
    content: ["### Book an appointment online"].join("\n\n") as Content,
    button: { label: "Continue to booking" as Label, url: nbsURl },
  };

  const walkIn: ActionWithButton = {
    type: ActionDisplayType.actionLinkWithInfo,
    content: [
      "### Get vaccinated without an appointment",
      "You can find a pharmacy that offers walk-in appointments without booking.",
    ].join("\n\n") as Content,
    button: {
      label: "Find a pharmacy where you can get a free flu vaccination" as Label,
      url: new URL(
        "https://www.nhs.uk/nhs-services/vaccination-and-booking-services/find-a-pharmacy-that-offers-free-flu-vaccination/",
      ) as ButtonUrl,
    },
  };
  return [bookWithGP, nbsBooking, walkIn];
}
