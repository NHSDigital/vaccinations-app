import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { removeExcludedHyperlinks } from "@src/services/content-api/parsers/content-filter-service";
import { ContentApiVaccineResponse, VaccinePageContent, VaccinePageSection } from "@src/services/content-api/types";

export const buildFilteredContentForWhoopingCoughVaccine = async (apiContent: string): Promise<VaccinePageContent> => {
  const content: ContentApiVaccineResponse = JSON.parse(apiContent);

  const paragraphs: string[] = content.mainEntityOfPage
    .flatMap((entity) => entity.hasPart ?? [])
    .map((part) => part?.text)
    .filter((text): text is string => !!text);

  const overview = { content: paragraphs[0], containsHtml: true };
  const whatVaccineIsFor: VaccinePageSection = {
    headline: "Why are pregnant women offered the vaccine?",
    subsections: [{ type: "simpleElement", headline: "", text: paragraphs[1], name: "markdown" }],
  };
  const whoVaccineIsFor: VaccinePageSection = {
    headline: "Is the vaccine safe in pregnancy?",
    subsections: [{ type: "simpleElement", headline: "", text: paragraphs[2], name: "markdown" }],
  };
  const howToGetVaccine: VaccinePageSection = {
    headline: "How to get the vaccine",
    subsections: removeExcludedHyperlinks([
      { type: "simpleElement", headline: "", text: paragraphs[14], name: "markdown" },
    ]),
  };
  const vaccineSideEffects: VaccinePageSection = {
    headline: "Side effects of the vaccine",
    subsections: [{ type: "simpleElement", headline: "", text: paragraphs[6], name: "markdown" }],
  };
  const webpageLink: URL = VaccineInfo[VaccineType.WHOOPING_COUGH].nhsWebpageLink;

  return {
    overview,
    actions: [],
    whatVaccineIsFor,
    whoVaccineIsFor,
    howToGetVaccine,
    vaccineSideEffects,
    webpageLink,
  };
};
