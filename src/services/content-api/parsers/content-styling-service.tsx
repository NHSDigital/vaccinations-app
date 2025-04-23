import sanitiseHtml from "@src/utils/sanitise-html";
import InsetText from "@src/app/_components/nhs-frontend/InsetText";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import React from "react";
import { JSX } from "react";
import { VaccineTypes } from "@src/models/vaccine";
import {
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/parsers/content-filter-service";

enum SubsectionTypes {
  INFORMATION = "INFORMATION",
  NON_URGENT = "NON_URGENT",
}

const Subsections: Record<SubsectionTypes, string> = {
  [SubsectionTypes.INFORMATION]: "Information",
  [SubsectionTypes.NON_URGENT]: "non-urgent",
};

export type StyledPageSection = {
  heading: string;
  component: JSX.Element;
};

export type NonUrgentContent = { heading: string; content: string };

export type StyledVaccineContent = {
  overview: string;
  whatVaccineIsFor?: StyledPageSection;
  whoVaccineIsFor: StyledPageSection;
  howToGetVaccine: StyledPageSection;
  webpageLink: string;
};

const styleSubsection = (
  subsection: VaccinePageSubsection,
  id: number,
): JSX.Element => {
  let text: string = subsection.text;
  if (subsection.headline) {
    text = `<h3 key={id}>${subsection.headline}</h3>`.concat(text);
  }
  if (subsection.name === Subsections.INFORMATION) {
    return <InsetText key={id} content={text} />;
  } else if (subsection.name === Subsections.NON_URGENT) {
    const { heading, content } = extractHeadingAndContent(subsection.text);
    return <NonUrgentCareCard key={id} heading={heading} content={content} />;
  } else {
    return <div key={id} dangerouslySetInnerHTML={sanitiseHtml(text)} />;
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

const extractHeadingAndContent = (text: string): NonUrgentContent => {
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
