import sanitiseHtml from "@src/utils/sanitise-html";
import InsetText from "@src/app/_components/nhs-frontend/InsetText";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import React, { JSX } from "react";
import { VaccineTypes } from "@src/models/vaccine";
import type {
  HeadingWithContent,
  StyledPageSection,
  StyledVaccineContent,
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";
import WarningCallout from "@src/app/_components/nhs-frontend/WarningCallout";

enum SubsectionTypes {
  INFORMATION = "INFORMATION",
  NON_URGENT = "NON_URGENT",
  CALLOUT = "CALLOUT",
}

const Subsections: Record<SubsectionTypes, string> = {
  [SubsectionTypes.INFORMATION]: "Information",
  [SubsectionTypes.NON_URGENT]: "non-urgent",
  [SubsectionTypes.CALLOUT]: "Callout",
};

const _getSanitizedHtml = (html: string, id: number) => {
  return <div key={id} dangerouslySetInnerHTML={sanitiseHtml(html)} />;
};

const styleSubsection = (
  subsection: VaccinePageSubsection,
  id: number,
): JSX.Element => {
  if (subsection.type === "expanderElement") {
    const content = `<h3 key={id}>${subsection.headline}</h3>`.concat(
      subsection.mainEntity,
    );
    return _getSanitizedHtml(content, id);
  }
  if (subsection.type === "tableElement") {
    return _getSanitizedHtml(subsection.mainEntity, id);
  }
  let text: string = subsection.text;
  if (subsection.headline) {
    text = `<h3 key={id}>${subsection.headline}</h3>`.concat(text);
  }
  if (subsection.name === Subsections.INFORMATION) {
    return <InsetText key={id} content={text} />;
  } else if (subsection.name === Subsections.NON_URGENT) {
    const { heading, content } = extractHeadingAndContent(subsection.text);
    return <NonUrgentCareCard key={id} heading={heading} content={content} />;
  } else if (subsection.name === Subsections.CALLOUT) {
    const { heading, content } = extractHeadingAndContent(subsection.text);
    return <WarningCallout key={id} heading={heading} content={content} />;
  } else {
    return _getSanitizedHtml(text, id);
  }
};

const styleSection = (section: VaccinePageSection): StyledPageSection => {
  const heading = section.headline;
  const styledComponent = (
    <>
      {section.subsections.map(
        (subsection: VaccinePageSubsection, index: number) =>
          styleSubsection(subsection, index),
      )}
    </>
  );
  return {
    heading,
    component: styledComponent,
  };
};

const extractHeadingAndContent = (text: string): HeadingWithContent => {
  const pattern: RegExp = /^<h3>(.*?)<\/h3>/;
  const match: RegExpMatchArray | null = pattern.exec(text);

  if (match) {
    const firstOccurrence: string = match[1];
    const remainingText: string = text.replace(pattern, "").trim();

    return { heading: firstOccurrence, content: remainingText };
  } else {
    return {
      heading: "",
      content: text,
    };
  }
};

const getStyledContentForVaccine = async (
  vaccine: VaccineTypes,
  filteredContent: VaccinePageContent,
): Promise<StyledVaccineContent> => {
  const overview: string = filteredContent.overview;
  let whatVaccineIsFor;
  if (filteredContent.whatVaccineIsFor) {
    whatVaccineIsFor = styleSection(filteredContent.whatVaccineIsFor);
  }
  const whoVaccineIsFor: StyledPageSection = styleSection(
    filteredContent.whoVaccineIsFor,
  );
  const howToGetVaccine: StyledPageSection = styleSection(
    filteredContent.howToGetVaccine,
  );
  const webpageLink: string = filteredContent.webpageLink;

  return {
    overview,
    whatVaccineIsFor,
    whoVaccineIsFor,
    howToGetVaccine,
    webpageLink,
  };
};

export {
  styleSubsection,
  styleSection,
  getStyledContentForVaccine,
  extractHeadingAndContent,
};
