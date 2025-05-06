import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import {
  ContentApiVaccineResponse,
  HasPartSubsection,
  MainEntityOfPage,
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";
import { Logger } from "pino";
import { logger } from "@src/utils/logger";

type Aspect =
  | "OverviewHealthAspect"
  | "BenefitsHealthAspect"
  | "SuitabilityHealthAspect"
  | "ContraindicationsHealthAspect"
  | "GettingAccessHealthAspect";

const log: Logger = logger.child({ module: "content-filter-service" });

const _findAspect = (
  response: ContentApiVaccineResponse,
  aspectName: Aspect,
): MainEntityOfPage => {
  const aspect: MainEntityOfPage | undefined = response.mainEntityOfPage.find(
    (page: MainEntityOfPage) => page.hasHealthAspect?.endsWith(aspectName),
  );
  if (!aspect) {
    throw new Error(`Aspect ${aspectName} is not present`);
  }
  return aspect;
};

const _hasHealthAspect = (
  response: ContentApiVaccineResponse,
  aspectName: Aspect,
): boolean => {
  const aspect: MainEntityOfPage | undefined = response.mainEntityOfPage.find(
    (page: MainEntityOfPage) => page.hasHealthAspect?.endsWith(aspectName),
  );
  return !!aspect;
};

const _extractHeadlineForAspect = (
  response: ContentApiVaccineResponse,
  aspectName: Aspect,
): string => {
  const aspect: MainEntityOfPage = _findAspect(response, aspectName);
  if (!aspect?.headline) {
    throw new Error(`Missing headline for Aspect: ${aspectName}`);
  }
  return aspect.headline;
};

const _extractPartsForAspect = (
  response: ContentApiVaccineResponse,
  aspectName: Aspect,
): VaccinePageSubsection[] => {
  const aspect: MainEntityOfPage = _findAspect(response, aspectName);
  const subsections: VaccinePageSubsection[] | undefined = aspect.hasPart?.map(
    (part: HasPartSubsection) => {
      if (part.name === "Table") {
        _extractTable(part);
      }
      if (part.name === "Expander") {
        _extractExpander(part);
      }
      return _extractSubsection(part);
    },
  );
  if (!subsections) {
    throw new Error(`Missing subsections for Aspect: ${aspectName}`);
  }
  return subsections;
};

const _extractTable = (part: HasPartSubsection): VaccinePageSubsection => {
  if (!part.mainEntity) {
    throw new Error(`Missing data for table: ${part}`);
  }
  return {
    type: "tableElement",
    name: part.name,
    mainEntity: part.mainEntity,
  };
};

const _extractExpander = (part: HasPartSubsection): VaccinePageSubsection => {
  if (!part.mainEntity) {
    throw new Error(`Missing data for expander text: ${part}`);
  }
  if (!part.subjectOf) {
    throw new Error(`Missing data for expander text: ${part}`);
  }
  return {
    type: "expanderElement",
    name: part.name,
    mainEntity: part.mainEntity,
    subjectOf: part.subjectOf,
  };
};

const _extractSubsection = (part: HasPartSubsection): VaccinePageSubsection => {
  if (!part.headline) {
    log.error(`Missing headline for part: ${part.name}`); // cannot throw error
  }
  return {
    type: "simpleElement",
    headline: part.headline || "",
    text: part.text,
    name: part.name,
  };
};

const _extractDescriptionForVaccine = (
  response: ContentApiVaccineResponse,
  name: string,
): string => {
  const mainEntity: MainEntityOfPage | undefined =
    response.mainEntityOfPage.find(
      (page: MainEntityOfPage) => page.name === name,
    );
  if (!mainEntity?.text) {
    throw new Error(`Missing text for description: ${name}`);
  }
  return mainEntity.text;
};

const _generateWhoVaccineIsForHeading = (vaccineType: VaccineTypes): string => {
  return `Who should have the ${VaccineInfo[vaccineType].displayName} vaccine`;
};

function _extractHeadlineForContraindicationsAspect(
  content: ContentApiVaccineResponse,
): VaccinePageSubsection[] {
  return [
    {
      type: "simpleElement",
      headline: _extractHeadlineForAspect(
        content,
        "ContraindicationsHealthAspect",
      ),
      text: "",
      name: "",
    },
  ];
}

const getFilteredContentForVaccine = async (
  vaccineName: VaccineTypes,
  apiContent: string,
): Promise<VaccinePageContent> => {
  const content: ContentApiVaccineResponse = JSON.parse(apiContent);
  const overview: string = _extractDescriptionForVaccine(
    content,
    "lead paragraph",
  );

  let whatVaccineIsFor;
  if (_hasHealthAspect(content, "BenefitsHealthAspect")) {
    whatVaccineIsFor = {
      headline: _extractHeadlineForAspect(content, "BenefitsHealthAspect"),
      subsections: _extractPartsForAspect(content, "BenefitsHealthAspect"),
    };
  }

  const whoVaccineIsFor: VaccinePageSection = {
    headline: _generateWhoVaccineIsForHeading(vaccineName),
    subsections: _extractPartsForAspect(content, "SuitabilityHealthAspect")
      .concat(_extractHeadlineForContraindicationsAspect(content))
      .concat(_extractPartsForAspect(content, "ContraindicationsHealthAspect")),
  };

  const howToGetVaccine: VaccinePageSection = {
    headline: _extractHeadlineForAspect(content, "GettingAccessHealthAspect"),
    subsections: _extractPartsForAspect(content, "GettingAccessHealthAspect"),
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
  _findAspect,
  _hasHealthAspect,
  _extractPartsForAspect,
  _extractHeadlineForAspect,
  _extractDescriptionForVaccine,
  _generateWhoVaccineIsForHeading,
  _extractHeadlineForContraindicationsAspect,
};
