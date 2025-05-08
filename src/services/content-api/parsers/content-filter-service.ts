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
  const subsections: VaccinePageSubsection[] | undefined =
    aspect.hasPart?.flatMap((part: HasPartSubsection) => {
      if (part.name === "Expander Group") {
        return _extractAllElementsFromExpanderGroup(part, aspectName);
      } else {
        return _getSubsection(part);
      }
    });
  return _getSubsections(aspectName, subsections);
};

const _extractAllElementsFromExpanderGroup = (
  part: HasPartSubsection,
  aspectName: Aspect,
) => {
  if (Array.isArray(part.mainEntity)) {
    const mainEntitySubsections = part.mainEntity.map((mainEntityElement) => {
      return _getSubsection(mainEntityElement);
    });
    return mainEntitySubsections;
  } else {
    throw new Error(
      `Expander Group mainEntity does not contain list of expanders for Aspect: ${aspectName}`,
    );
  }
};

const _extractTable = (part: HasPartSubsection): VaccinePageSubsection => {
  if (!part.mainEntity) {
    throw new Error(`Missing data for table: ${part}`);
  }
  if (typeof part.mainEntity == "string") {
    return {
      type: "tableElement",
      name: part.name,
      mainEntity: part.mainEntity,
    };
  } else {
    throw new Error(`mainEntity in table not a string: ${part}`);
  }
};

const _extractExpander = (part: HasPartSubsection): VaccinePageSubsection => {
  if (!part.mainEntity || !part.subjectOf) {
    throw new Error(
      `mainEntity or subjectOf field missing in Expander (position: ${part.position}, identifier: ${part.identifier})`,
    );
  }
  if (typeof part.mainEntity == "string") {
    return {
      type: "expanderElement",
      name: part.name,
      mainEntity: part.mainEntity,
      headline: part.subjectOf,
    };
  } else {
    throw new Error(
      `mainEntity in Expander is not a string (position: ${part.position}, identifier: ${part.identifier})`,
    );
  }
};

const _extractAnyOtherSubsection = (
  part: HasPartSubsection,
): VaccinePageSubsection => {
  if (!part.headline) {
    log.info(`Headline not present for part: ${part.name}`); // cannot throw error; some elements expected to not have headlines
  }
  return {
    type: "simpleElement",
    headline: part.headline ?? "",
    text: part.text ?? "",
    name: part.name,
  };
};

const _getSubsection = (part: HasPartSubsection): VaccinePageSubsection => {
  if (part.name === "Table") {
    return _extractTable(part);
  }
  if (part.name === "Expander") {
    return _extractExpander(part);
  }
  return _extractAnyOtherSubsection(part);
};

const _getSubsections = (
  aspectName: Aspect,
  subsections?: VaccinePageSubsection[],
): VaccinePageSubsection[] => {
  if (!subsections) {
    throw new Error(`Missing subsections for Aspect: ${aspectName}`);
  }
  return subsections;
};

const _extractDescriptionForVaccine = (
  response: ContentApiVaccineResponse,
  name: string,
): string => {
  const mainEntity: MainEntityOfPage | undefined =
    response.mainEntityOfPage.find(
      (page: MainEntityOfPage) => page.name === name,
    );
  return _getDescription(name, mainEntity?.text);
};

const _getDescription = (name: string, description?: string): string => {
  if (!description) {
    throw new Error(`Missing text for description: ${name}`);
  }
  return description;
};

const _generateWhoVaccineIsForHeading = (vaccineType: VaccineTypes): string => {
  return `Who should have the ${VaccineInfo[vaccineType].displayName.lowercase} vaccine`;
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
