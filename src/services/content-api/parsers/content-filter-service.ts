import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";

type Aspect =
  | "OverviewHealthAspect"
  | "BenefitsHealthAspect"
  | "SuitabilityHealthAspect"
  | "ContraindicationsHealthAspect"
  | "GettingAccessHealthAspect";

type HasPartSubsection = {
  "@type": string;
  text: string;
  name: string;
  headline?: string;
  position: number;
  identifier: string;
};

type MainEntityOfPage = {
  "@type": string;
  hasHealthAspect?: string;
  position: number;
  identifier: number | string;
  headline?: string;
  text?: string;
  name: string;
  hasPart?: HasPartSubsection[];
  mainEntityOfPage?: MainEntityOfPage[];
  description?: string;
};

export type ContentApiVaccineResponse = {
  "@context": string;
  "@type": string;
  "name": string;
  mainEntityOfPage: MainEntityOfPage[];
  webpage: string;
  "copyrightHolder": object;
  "license": string;
  "author": object;
  "about": object;
  "description": string;
  "url": string;
  "genre": object;
  "keywords": string;
  "dateModified": string;
  "lastReviewed": string[];
  "breadcrumb": object;
  "hasPart": object;
  "relatedLink": object;
  "contentSubTypes": object;
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
  if (!aspect.headline) {
    throw new Error(`Missing headline for Aspect: ${aspectName}`);
  }
  return aspect.headline;
};

const extractPartsForAspect = (
  response: ContentApiVaccineResponse,
  aspectName: Aspect,
): VaccinePageSubsection[] => {
  const aspect: MainEntityOfPage = findAspect(response, aspectName);
  const subsections: VaccinePageSubsection[] | undefined = aspect.hasPart?.map(
    (part: HasPartSubsection) => {
      // TODO: fix the schema so that we handle part.headline being undefined
      // if (!part.headline) {
      //   // throw new Error(`Missing headline for part: ${part.name}`);
      // }
      return {
        headline: part.headline ?? "",
        text: part.text,
        name: part.name,
      };
    },
  );
  if (!subsections) {
    throw new Error(`Missing subsections for Aspect: ${aspectName}`);
  }
  return subsections;
};

const extractDescriptionForVaccine = (
  response: ContentApiVaccineResponse,
  name: string,
): string => {
  const mainEntity = response.mainEntityOfPage.find(
    (page: MainEntityOfPage) => page.name === name,
  );
  if (!mainEntity || !mainEntity.text) {
    throw new Error(`Missing text for description: ${name}`);
  }
  return mainEntity.text;
};

const generateWhoVaccineIsForHeading = (vaccineType: VaccineTypes): string => {
  return `Who should have the ${VaccineDisplayNames[vaccineType]} vaccine`;
};

const getFilteredContentForVaccine = async (
  vaccineName: VaccineTypes,
  apiContent: string
): Promise<VaccinePageContent> => {
  const content: ContentApiVaccineResponse = JSON.parse(apiContent);
  const overview: string = extractDescriptionForVaccine(content, "lead paragraph");

  const whatVaccineIsFor: VaccinePageSection = {
    headline: extractHeadlineForAspect(content, "BenefitsHealthAspect"),
    subsections: extractPartsForAspect(content, "BenefitsHealthAspect"),
  };

  const whoVaccineIsFor: VaccinePageSection = {
    headline: generateWhoVaccineIsForHeading(vaccineName),
    subsections: extractPartsForAspect(
      content,
      "SuitabilityHealthAspect",
    ).concat(extractPartsForAspect(content, "ContraindicationsHealthAspect")),
  };

  const howToGetVaccine: VaccinePageSection = {
    headline: extractHeadlineForAspect(content, "GettingAccessHealthAspect"),
    subsections: extractPartsForAspect(content, "GettingAccessHealthAspect"),
  };

  const webpageLink: string = content.webpage;

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
