import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/contentService";

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

type VaccinePageSubsection = {
  headline: string;
  text: string;
  name: string;
};

type VaccinePageSection = {
  headline: string;
  subsections: VaccinePageSubsection[];
};

type VaccinePageContent = {
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
  const subsections: VaccinePageSubsection[] = aspect!.hasPart.map(
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

// Anoop's corner

// type HasPartSubsection
// position: int    --- do we need this?
// identifier: string   --- do we need this?
// text: string
// @type: string    --- do we need this?
// name: string (used for styling)
// headline: string

// type MainEntityOfPage
// hasHealthAspect?: string (does not exist for object that is used to get the paragraph for overview)
// headline: string   --- do we need this?
// position: int    --- do we need this?
// text: string
// name: string (NOT used for styling here) We NEED this to get the overview paragraph, its called "lead paragraph"
// description: string    --- do we need this?
// hasPart: HasPartSubsection[]
// mainEntityOfPage: HasPartSubsection[]    --- do we need this if we decide to use hasPart?

// type ContentApiVaccineResponse
// mainEntityOfPage: MainEntityOfPage[]

// type VaccinePageSubsection
// headline: string
// text: string
// name: string (used for styling)
// position: int (seems to be used for ordering the content on the page. Do we need this?)

// type VaccinePageSection
// headline: string
// subsections: VaccinePageSubsection[]

// type VaccinePageContent
// overview: string
// whatVaccineIsFor: VaccinePageSection
// whoVaccineIsFor: VaccinePageSection
// howToGetVaccine: VaccinePageSection
// webpageLink: string;

// findAspect(response: ContentApiVaccineResponse, aspectName: Aspect): MainEntityOfPage
// const aspect: MainEntityOfPage = response.MainEntityOfPage.find((page: MainEntityOfPage) =>
//    page.hasHealthAspect.endsWith(aspectName));
// return aspect;

// extractHeadlineForAspect(response: ContentApiVaccineResponse, aspectName: Aspect): string
// const aspect: MainEntityOfPage = findAspect(contentApiVaccineText, aspectName);
// return aspect!.headline;

// extractPartsForAspect(response: ContentApiVaccineResponse, aspectName: Aspect): VaccinePageSubsection[]
// const aspect: MainEntityOfPage = findAspect(response, aspectName);
// const subsections: VaccinePageSubsection[] = aspect!.hasPart.map((part: HasPartSubsection) => {
//    return {
//        headline: part.headline,
//        text: part.text,
//        name: part.name,
//        position: part.position }
//    });

// extractDescriptionForVaccine(response: ContentApiVaccineResponse, name: string): string    --- this is overview
// const mainEntity: MainEntityOfPage = response.MainEntityOfPage.find((page: MainEntityOfPage) =>
//    page.name === name);
// return mainEntity.text

// generateWhoVaccineIsForHeading(vaccineType: VaccineTypes): string
// return `Who should have the ${VaccineDisplayNames[vaccineType]} vaccine`;

// getPageCopyOfVaccine(vaccineName: VaccineTypes): VaccinePageContent
// const response = await getContentForVaccine(vaccineName);
// const overview = extractDescriptionForVaccine(response, "lead paragraph");
// const whatVaccineIsFor: VaccinePageSection = {
//    headline: extractHeadlineForAspect(response, "BenefitsHealthAspect"),
//    subsections: extractPartsForAspect(response, "BenefitsHealthAspect")
// }
// const whoVaccineIsFor: VaccinePageSection = {
//    headline: generateWhoVaccineIsForHeading(vaccineName),
//    subsections: extractPartsForAspect(response, "SuitabilityHealthAspect")
//        .concat(extractPartsForAspect(response, "ContraindicationsHealthAspect"))
// }
// const howToGetVaccine: VaccinePageSection = {
//    headline: extractHeadlineForAspect(response, "GettingAccessHealthAspect"),
//    subsections: extractPartsForAspect(response, "GettingAccessHealthAspect")
// }
// const webpageLink: string = response.webpage;
// return {
//    overview,
//    whatVaccineIsFor,
//    whoVaccineIsFor,
//    howToGetVaccine,
//    webpageLink
// }

// Anoop's corner END
