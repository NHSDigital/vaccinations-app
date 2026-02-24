import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { removeExcludedHyperlinks } from "@src/services/content-api/parsers/content-filter-service";
import { ContentApiVaccineResponse, VaccinePageContent, VaccinePageSection } from "@src/services/content-api/types";

const WHAT_VACCINE_IS_FOR_SECTION_INDEX = 1;
const WHO_VACCINE_IS_FOR_SECTION_INDEX = 3;
const HOW_TO_GET_VACCINE_SECTION_INDEX = 14;
const SIDE_EFFECTS_OF_VACCINE_SECTION_INDEX = 6;

export const buildFilteredContentForWhoopingCoughVaccine = async (apiContent: string): Promise<VaccinePageContent> => {
  const content: ContentApiVaccineResponse = JSON.parse(apiContent);

  const sectionsOfPage: string[] = content.mainEntityOfPage
    .flatMap((entity) => entity.hasPart ?? [])
    .map((part) => part?.text)
    .filter((text): text is string => !!text);

  const overview = { content: sectionsOfPage[0], containsHtml: true };
  const whatVaccineIsFor: VaccinePageSection = {
    headline: "Why are pregnant women offered the vaccine?",
    subsections: [
      {
        type: "simpleElement",
        headline: "",
        text: sectionsOfPage[WHAT_VACCINE_IS_FOR_SECTION_INDEX],
        name: "markdown",
      },
    ],
  };

  const whoVaccineIsFor: VaccinePageSection = {
    headline: "Is the vaccine safe in pregnancy?",
    subsections: [
      { type: "simpleElement", headline: "", text: sectionsOfPage[WHO_VACCINE_IS_FOR_SECTION_INDEX], name: "markdown" },
    ],
  };
  const howToGetVaccine: VaccinePageSection = {
    headline: "How to get the vaccine",
    subsections: removeExcludedHyperlinks([
      { type: "simpleElement", headline: "", text: sectionsOfPage[HOW_TO_GET_VACCINE_SECTION_INDEX], name: "markdown" },
    ]),
  };
  const vaccineSideEffects: VaccinePageSection = {
    headline: "Side effects of the vaccine",
    subsections: [
      {
        type: "simpleElement",
        headline: "",
        text: sectionsOfPage[SIDE_EFFECTS_OF_VACCINE_SECTION_INDEX],
        name: "markdown",
      },
    ],
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
