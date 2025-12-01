import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import {
  ContentApiVaccineResponse,
  HeadingWithContent,
  HeadingWithTypedContent,
  VaccinePageContent,
  VaccinePageSection,
} from "@src/services/content-api/types";

export const getFilteredContentForFluInPregnancyVaccine = (apiContent: string): VaccinePageContent => {
  const content: ContentApiVaccineResponse = JSON.parse(apiContent);

  const paragraphs: string[] = content.mainEntityOfPage
    .flatMap((entity) => entity.hasPart ?? [])
    .map((part) => part?.text)
    .filter((text): text is string => !!text);

  const whyOffered: VaccinePageSection = {
    headline: "Why pregnant women are offered the vaccine",
    subsections: [{ type: "simpleElement", headline: "", text: paragraphs[1], name: "markdown" }],
  };
  const isItSafe: VaccinePageSection = {
    headline: "Is the vaccine safe in pregnancy?",
    subsections: [{ type: "simpleElement", headline: "", text: paragraphs[2], name: "markdown" }],
  };
  const howToGetVaccine: VaccinePageSection = {
    headline: "How to get the vaccine",
    subsections: [{ type: "simpleElement", headline: "", text: paragraphs[4], name: "markdown" }],
  };
  const whenToGet: VaccinePageSection = {
    headline: "When should I have the vaccine?",
    subsections: [{ type: "simpleElement", headline: "", text: paragraphs[3], name: "markdown" }],
  };
  const webpageLink: URL = VaccineInfo[VaccineType.WHOOPING_COUGH].nhsWebpageLink;
  const callout: HeadingWithTypedContent = {
    heading: "Booking service closed",
    content: "Flu vaccine bookings will reopen in autumn 2026",
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
  };
};
