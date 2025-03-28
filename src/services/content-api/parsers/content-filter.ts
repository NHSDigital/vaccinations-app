import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-service";

type Aspect =
  | "OverviewHealthAspect"
  | "BenefitsHealthAspect"
  | "SuitabilityHealthAspect"
  | "ContraindicationsHealthAspect"
  | "GettingAccessHealthAspect";

type HasPartSubsection = {
  text: string;
  name: string;
  headline: string;
};

type MainEntityOfPage = {
  hasHealthAspect?: string;
  headline: string;
  text: string;
  name: string;
  hasPart: HasPartSubsection[];
};

type ContentApiVaccineResponse = {
  mainEntityOfPage: MainEntityOfPage[];
};

export type VaccinePageSubsection = {
  headline: string;
  text: string;
  name: string;
};

export type VaccinePageSection = {
  headline: string;
  subsections: VaccinePageSubsection[];
};

export type VaccinePageContent = {
  overview: string;
  whatVaccineIsFor: VaccinePageSection;
  whoVaccineIsFor: VaccinePageSection;
  howToGetVaccine: VaccinePageSection;
  webpageLink: string;
};

const findAspect = (
  response: ContentApiVaccineResponse,
  aspectName: Aspect,
) => {
  const aspect = response.mainEntityOfPage.find((page: MainEntityOfPage) =>
    page.hasHealthAspect?.endsWith(aspectName),
  );
  return aspect!;
};

const extractHeadlineForAspect = (
  response: ContentApiVaccineResponse,
  aspectName: Aspect,
): string => {
  const aspect: MainEntityOfPage = findAspect(response, aspectName);
  return aspect.headline;
};

const extractPartsForAspect = (
  response: ContentApiVaccineResponse,
  aspectName: Aspect,
): VaccinePageSubsection[] => {
  const aspect: MainEntityOfPage = findAspect(response, aspectName);
  const subsections: VaccinePageSubsection[] = aspect.hasPart.map(
    (part: HasPartSubsection) => {
      return {
        headline: part.headline,
        text: part.text,
        name: part.name,
      };
    },
  );
  return subsections;
};

const extractDescriptionForVaccine = (
  response: ContentApiVaccineResponse,
  name: string,
): string => {
  const mainEntity = response.mainEntityOfPage.find(
    (page: MainEntityOfPage) => page.name === name,
  );
  return mainEntity!.text;
};

const generateWhoVaccineIsForHeading = (vaccineType: VaccineTypes): string => {
  return `Who should have the ${VaccineDisplayNames[vaccineType]} vaccine`;
};

const getFilteredContentForVaccine = async (
  vaccineName: VaccineTypes,
): Promise<VaccinePageContent> => {
  const response = await getContentForVaccine(vaccineName);

  const overview = extractDescriptionForVaccine(response, "lead paragraph");

  const whatVaccineIsFor: VaccinePageSection = {
    headline: extractHeadlineForAspect(response, "BenefitsHealthAspect"),
    subsections: extractPartsForAspect(response, "BenefitsHealthAspect"),
  };

  const whoVaccineIsFor: VaccinePageSection = {
    headline: generateWhoVaccineIsForHeading(vaccineName),
    subsections: extractPartsForAspect(
      response,
      "SuitabilityHealthAspect",
    ).concat(extractPartsForAspect(response, "ContraindicationsHealthAspect")),
  };

  const howToGetVaccine: VaccinePageSection = {
    headline: extractHeadlineForAspect(response, "GettingAccessHealthAspect"),
    subsections: extractPartsForAspect(response, "GettingAccessHealthAspect"),
  };

  const webpageLink: string = response.webpage;

  return {
    overview,
    whatVaccineIsFor,
    whoVaccineIsFor,
    howToGetVaccine,
    webpageLink,
  };
};

export {
  getFilteredContentForVaccine,
  extractPartsForAspect,
  extractHeadlineForAspect,
  extractDescriptionForVaccine,
  generateWhoVaccineIsForHeading,
};
