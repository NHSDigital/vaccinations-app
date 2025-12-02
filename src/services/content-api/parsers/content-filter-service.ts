import { VaccineType } from "@src/models/vaccine";
import { getAdditionalContentForCovid19Vaccine } from "@src/services/content-api/parsers/custom/covid-19";
import { getFilteredContentForFluInPregnancyVaccine } from "@src/services/content-api/parsers/custom/flu-in-pregnancy";
import { getFilteredContentForFluVaccine } from "@src/services/content-api/parsers/custom/flu-vaccine";
import { getFilteredContentForWhoopingCoughVaccine } from "@src/services/content-api/parsers/custom/whooping-cough";
import {
  ContentApiVaccineResponse,
  HasPartSubsection,
  HeadingWithTypedContent,
  MainEntityOfPage,
  Overview,
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";

type Aspect =
  | "OverviewHealthAspect"
  | "BenefitsHealthAspect"
  | "SuitabilityHealthAspect"
  | "ContraindicationsHealthAspect"
  | "GettingAccessHealthAspect"
  | "SideEffectsHealthAspect";

const _findAspect = (response: ContentApiVaccineResponse, aspectName: Aspect): MainEntityOfPage => {
  const aspect: MainEntityOfPage | undefined = response.mainEntityOfPage.find((page: MainEntityOfPage) =>
    page.hasHealthAspect?.endsWith(aspectName),
  );
  if (!aspect) {
    throw new Error(`Aspect ${aspectName} is not present`);
  }
  return aspect;
};

const _hasHealthAspect = (response: ContentApiVaccineResponse, aspectName: Aspect): boolean => {
  const aspect: MainEntityOfPage | undefined = response.mainEntityOfPage.find((page: MainEntityOfPage) =>
    page.hasHealthAspect?.endsWith(aspectName),
  );
  return !!aspect;
};

const _extractHeadlineForAspect = (response: ContentApiVaccineResponse, aspectName: Aspect): string => {
  const aspect: MainEntityOfPage = _findAspect(response, aspectName);
  if (!aspect?.headline) {
    throw new Error(`Missing headline for Aspect: ${aspectName}`);
  }
  return aspect.headline;
};

const _extractPartsForAspect = (response: ContentApiVaccineResponse, aspectName: Aspect): VaccinePageSubsection[] => {
  const aspect: MainEntityOfPage = _findAspect(response, aspectName);
  const subsections: VaccinePageSubsection[] | undefined = aspect.hasPart?.flatMap((part: HasPartSubsection) => {
    if (part.name === "Expander Group") {
      return _extractAllElementsFromExpanderGroup(part, aspectName);
    } else {
      return _getSubsection(part);
    }
  });

  if (!subsections) {
    throw new Error(`Missing subsections for Aspect: ${aspectName}`);
  } else {
    const subsectionsWithExcludedLinksRemoved = _removeExcludedHyperlinks(subsections);
    return subsectionsWithExcludedLinksRemoved;
  }
};

const _extractAllElementsFromExpanderGroup = (part: HasPartSubsection, aspectName: Aspect) => {
  if (Array.isArray(part.mainEntity)) {
    const mainEntitySubsections = part.mainEntity.map((mainEntityElement) => {
      return _getSubsection(mainEntityElement);
    });
    return mainEntitySubsections;
  } else {
    throw new Error(`Expander Group mainEntity does not contain list of expanders for Aspect: ${aspectName}`);
  }
};

const _extractTable = (part: HasPartSubsection): VaccinePageSubsection => {
  if (!part.mainEntity || typeof part.mainEntity != "string") {
    throw new Error(`mainEntity missing or is not a string in Table (position: ${part.position})`);
  } else {
    return {
      type: "tableElement",
      name: part.name,
      mainEntity: part.mainEntity,
    };
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

const _extractAnyOtherSubsection = (part: HasPartSubsection): VaccinePageSubsection => {
  return {
    type: "simpleElement",
    headline: part.headline ?? "",
    text: part.text ?? "",
    name: part.name,
  };
};

const _findCalloutElement = (response: ContentApiVaccineResponse): HasPartSubsection | undefined => {
  for (const section of response.mainEntityOfPage) {
    if (section.hasPart && Array.isArray(section.hasPart)) {
      const callout = section.hasPart.find((element) => element.name === "Callout");
      if (callout) {
        return callout;
      }
    }
  }
  return undefined;
};

function _hasCallout(response: ContentApiVaccineResponse): boolean {
  return !!_findCalloutElement(response);
}

function _extractCalloutHeading(response: ContentApiVaccineResponse): string {
  const calloutElement = _findCalloutElement(response);

  if (!calloutElement || !calloutElement.text) {
    return "";
  }

  const match = calloutElement.text.match(/<h3>(.*?)<\/h3>/);
  return match ? match[1] : "";
}

function _extractCalloutContent(response: ContentApiVaccineResponse): string {
  const calloutElement = _findCalloutElement(response);

  if (!calloutElement || !calloutElement.text) {
    return "";
  }

  const content = calloutElement.text.replace(/<h3>.*?<\/h3>/, "").trim();

  return content;
}

const _removeExcludedHyperlinks = (subsections: VaccinePageSubsection[]) => {
  const nbsHyperlinkPattern: RegExp =
    /<a [^>]*?href="[^>]*?\/nhs-services\/vaccination-and-booking-services\/book-[^>]*?>(.*?)<\/a>/g;
  const nhsAppPattern: RegExp = /<a [^>]*?href="[^>]*?\/nhs-app[^>]*?>(.*?)<\/a>/g;

  subsections.forEach((subsection) => {
    if (subsection.type === "simpleElement") {
      subsection.text = subsection.text.replaceAll(nbsHyperlinkPattern, "$1");
      subsection.text = subsection.text.replaceAll(nhsAppPattern, "$1");
    } else {
      subsection.mainEntity = subsection.mainEntity.replaceAll(nbsHyperlinkPattern, "$1");
      subsection.mainEntity = subsection.mainEntity.replaceAll(nhsAppPattern, "$1");
    }
  });
  return subsections;
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

const _extractDescriptionForVaccine = (response: ContentApiVaccineResponse, name: string): string => {
  const mainEntity: MainEntityOfPage | undefined = response.mainEntityOfPage.find(
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

function _extractHeadlineForContraindicationsAspect(content: ContentApiVaccineResponse): VaccinePageSubsection[] {
  return [
    {
      type: "simpleElement",
      headline: _extractHeadlineForAspect(content, "ContraindicationsHealthAspect"),
      text: "",
      name: "",
    },
  ];
}

const getFilteredContentForVaccine = (vaccineType: VaccineType, apiContent: string): VaccinePageContent => {
  switch (vaccineType) {
    case VaccineType.WHOOPING_COUGH:
      return getFilteredContentForWhoopingCoughVaccine(apiContent);
    case VaccineType.FLU_IN_PREGNANCY:
      return getFilteredContentForFluInPregnancyVaccine(apiContent);
    case VaccineType.FLU_FOR_ADULTS:
      return getFilteredContentForFluVaccine(apiContent);
    case VaccineType.COVID_19:
      const standardVaccineContent = getFilteredContentForStandardVaccine(apiContent);
      const additionalCovid19VaccineContent = getAdditionalContentForCovid19Vaccine();
      return {
        ...standardVaccineContent,
        ...additionalCovid19VaccineContent,
      };
    default:
      return getFilteredContentForStandardVaccine(apiContent);
  }
};

const getFilteredContentForStandardVaccine = (apiContent: string): VaccinePageContent => {
  const content: ContentApiVaccineResponse = JSON.parse(apiContent);

  const overview: Overview = { content: _extractDescriptionForVaccine(content, "lead paragraph"), containsHtml: false };

  let whatVaccineIsFor;
  if (_hasHealthAspect(content, "BenefitsHealthAspect")) {
    whatVaccineIsFor = {
      headline: _extractHeadlineForAspect(content, "BenefitsHealthAspect"),
      subsections: _extractPartsForAspect(content, "BenefitsHealthAspect"),
    };
  }

  const whoVaccineIsFor: VaccinePageSection = {
    headline: _extractHeadlineForAspect(content, "SuitabilityHealthAspect"),
    subsections: _extractPartsForAspect(content, "SuitabilityHealthAspect")
      .concat(_extractHeadlineForContraindicationsAspect(content))
      .concat(_extractPartsForAspect(content, "ContraindicationsHealthAspect")),
  };

  const howToGetVaccine: VaccinePageSection = {
    headline: _extractHeadlineForAspect(content, "GettingAccessHealthAspect"),
    subsections: _extractPartsForAspect(content, "GettingAccessHealthAspect"),
  };

  const vaccineSideEffects: VaccinePageSection = {
    headline: _extractHeadlineForAspect(content, "SideEffectsHealthAspect"),
    subsections: _extractPartsForAspect(content, "SideEffectsHealthAspect"),
  };

  let callout: HeadingWithTypedContent | undefined;
  if (_hasCallout(content)) {
    callout = {
      heading: _extractCalloutHeading(content),
      content: _extractCalloutContent(content),
      contentType: "html",
    };
  }

  const webpageLink: URL = new URL(content.webpage);

  return {
    overview,
    whatVaccineIsFor,
    whoVaccineIsFor,
    howToGetVaccine,
    vaccineSideEffects,
    webpageLink,
    callout,
  };
};

export {
  getFilteredContentForVaccine,
  getFilteredContentForStandardVaccine,
  _findAspect,
  _hasHealthAspect,
  _extractPartsForAspect,
  _extractHeadlineForAspect,
  _extractDescriptionForVaccine,
  _extractHeadlineForContraindicationsAspect,
  _removeExcludedHyperlinks,
};
