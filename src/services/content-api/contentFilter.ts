"use server";

import { getContentForVaccine } from "@src/services/content-api/contentService";
import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";

type Aspect =
  | "OverviewHealthAspect"
  | "BenefitsHealthAspect"
  | "SuitabilityHealthAspect"
  | "ContraindicationsHealthAspect"
  | "GettingAccessHealthAspect";

type HasPartSubsection = {
  text: string;
  "@type": string;
  headline?: string;
  identifier?: string;
};

type HasPart = {
  "@type": string;
  hasHealthAspect: string;
  description: string;
  headline: string;
  url: string;
  hasPart: HasPartSubsection[];
};

export type ContentApiVaccineResponse = {
  hasPart: HasPart[];
};

type VaccinePageSection = { heading: string; text: string };

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
  const aspect = response.hasPart.find((part: HasPart) =>
    part.hasHealthAspect.endsWith(aspectName),
  );
  return aspect;
};

const extractAllPartsTextForAspect = (
  response: ContentApiVaccineResponse,
  aspectName: Aspect,
): string => {
  const aspectInfo = findAspect(response, aspectName);
  const aspect = aspectInfo!.hasPart
    .map((part: HasPartSubsection) => part.text)
    .join("");
  return aspect;
};

const extractHeadlineForAspect = (
  contentApiVaccineText: ContentApiVaccineResponse,
  aspectName: Aspect,
): string => {
  const aspect = findAspect(contentApiVaccineText, aspectName);
  return aspect!.headline;
};

const extractDescriptionForAspect = (
  contentApiVaccineText: ContentApiVaccineResponse,
  aspectName: Aspect,
): string => {
  const aspect = findAspect(contentApiVaccineText, aspectName);
  return aspect!.description;
};

const generateWhoVaccineIsForHeading = (vaccineType: VaccineTypes) => {
  return `Who should have the ${VaccineDisplayNames[vaccineType]} vaccine`;
};

const getPageCopyForVaccine = async (
  vaccineName: VaccineTypes,
): Promise<VaccinePageContent> => {
  const response = await getContentForVaccine(vaccineName);

  const overview = extractDescriptionForAspect(
    response,
    "OverviewHealthAspect",
  );

  const whatVaccineIsFor: VaccinePageSection = {
    heading: extractHeadlineForAspect(response, "BenefitsHealthAspect"),
    text: extractAllPartsTextForAspect(response, "BenefitsHealthAspect"),
  };

  const whoVaccineIsFor: VaccinePageSection = {
    heading: generateWhoVaccineIsForHeading(vaccineName),
    text: extractAllPartsTextForAspect(
      response,
      "SuitabilityHealthAspect",
    ).concat(
      extractAllPartsTextForAspect(response, "ContraindicationsHealthAspect"),
    ),
  };

  const howToGetVaccine: VaccinePageSection = {
    heading: extractHeadlineForAspect(response, "GettingAccessHealthAspect"),
    text: extractAllPartsTextForAspect(response, "GettingAccessHealthAspect"),
  };

  const webpageLink = response.webpage;

  return {
    overview,
    whatVaccineIsFor,
    whoVaccineIsFor,
    howToGetVaccine,
    webpageLink,
  };
};

export {
  getPageCopyForVaccine,
  extractDescriptionForAspect,
  extractAllPartsTextForAspect,
  generateWhoVaccineIsForHeading,
};
