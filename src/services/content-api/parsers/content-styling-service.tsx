import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import UrgentCareCard from "@src/app/_components/nhs-frontend/UrgentCareCard";
import { VaccineType } from "@src/models/vaccine";
import { styleHowToGetSectionForRsv } from "@src/services/content-api/parsers/custom/rsv";
import { styleHowToGetSectionForRsvPregnancy } from "@src/services/content-api/parsers/custom/rsv-pregnancy";
import type {
  HeadingWithContent,
  Overview,
  StyledPageSection,
  StyledVaccineContent,
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";
import sanitiseHtml from "@src/utils/sanitise-html";
import { InsetText, WarningCallout } from "nhsuk-react-components";
import React, { JSX } from "react";

import styles from "./styles.module.css";

enum SubsectionTypes {
  INFORMATION = "INFORMATION",
  NON_URGENT = "NON_URGENT",
  URGENT = "URGENT",
  CALLOUT = "CALLOUT",
}

const Subsections: Record<SubsectionTypes, string> = {
  [SubsectionTypes.INFORMATION]: "Information",
  [SubsectionTypes.NON_URGENT]: "non-urgent",
  [SubsectionTypes.URGENT]: "urgent",
  [SubsectionTypes.CALLOUT]: "Callout",
};

const _getDivWithSanitisedHtml = (html: string) => {
  return <div className={styles.zeroMarginBottom} dangerouslySetInnerHTML={{ __html: sanitiseHtml(html) }} />;
};

const styleSubsection = (subsection: VaccinePageSubsection, id: number, isLastSubsection: boolean): JSX.Element => {
  if (subsection.type === "expanderElement") {
    const content = `<h3>${subsection.headline}</h3>`.concat(subsection.mainEntity);
    return <div key={id} dangerouslySetInnerHTML={{ __html: sanitiseHtml(content) }} />;
  }

  if (subsection.type === "tableElement") {
    return (
      <div
        key={id}
        dangerouslySetInnerHTML={{
          __html: sanitiseHtml(subsection.mainEntity),
        }}
      />
    );
  }

  let text: string = subsection.text;
  if (subsection.headline) {
    text = `<h3>${subsection.headline}</h3>`.concat(text);
  }

  if (subsection.name === Subsections.INFORMATION) {
    return <InsetText key={id}>{_getDivWithSanitisedHtml(text)}</InsetText>;
  } else if (subsection.name === Subsections.NON_URGENT) {
    const { heading, content } = extractHeadingAndContent(subsection.text);
    return (
      <NonUrgentCareCard
        key={id}
        heading={_getDivWithSanitisedHtml(heading)}
        content={_getDivWithSanitisedHtml(content)}
      />
    );
  } else if (subsection.name === Subsections.URGENT) {
    const { heading, content } = extractHeadingAndContent(subsection.text);
    return (
      <UrgentCareCard
        key={id}
        heading={_getDivWithSanitisedHtml(heading)}
        content={_getDivWithSanitisedHtml(content)}
      />
    );
  } else if (subsection.name === Subsections.CALLOUT) {
    const { heading, content } = extractHeadingAndContent(subsection.text);
    return (
      <WarningCallout key={id}>
        <WarningCallout.Heading>{_getDivWithSanitisedHtml(heading)}</WarningCallout.Heading>
        {_getDivWithSanitisedHtml(content)}
      </WarningCallout>
    );
  } else {
    return (
      <div
        className={isLastSubsection ? styles.zeroMarginBottom : undefined}
        key={id}
        dangerouslySetInnerHTML={{ __html: sanitiseHtml(text) }}
      ></div>
    );
  }
};

const styleSection = (section: VaccinePageSection): StyledPageSection => {
  const heading = section.headline;
  const indexOfLastChild: number = section.subsections.length - 1;

  const styledComponent = (
    <>
      {section.subsections.map((subsection: VaccinePageSubsection, index: number) =>
        styleSubsection(subsection, index, index == indexOfLastChild),
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

const styleHowToGetSection = (
  vaccineType: VaccineType,
  section: VaccinePageSection,
  fragile: boolean,
): StyledPageSection => {
  switch (vaccineType) {
    case VaccineType.RSV:
      return styleHowToGetSectionForRsv(section, fragile);
    case VaccineType.RSV_PREGNANCY:
      return styleHowToGetSectionForRsvPregnancy(section, fragile);
    default:
      return styleSection(section);
  }
};

function styleCallout(callout: HeadingWithContent | undefined): HeadingWithContent | undefined {
  if (callout) {
    return { heading: callout.heading, content: callout.content };
  }
  return undefined;
}

const getStyledContentForVaccine = async (
  vaccine: VaccineType,
  filteredContent: VaccinePageContent,
  fragile: boolean,
): Promise<StyledVaccineContent> => {
  const overview: Overview = filteredContent.overview;
  let whatVaccineIsFor;
  if (filteredContent.whatVaccineIsFor) {
    whatVaccineIsFor = styleSection(filteredContent.whatVaccineIsFor);
  }
  const whoVaccineIsFor: StyledPageSection = styleSection(filteredContent.whoVaccineIsFor);
  const howToGetVaccine: StyledPageSection = styleHowToGetSection(vaccine, filteredContent.howToGetVaccine, fragile);
  const vaccineSideEffects: StyledPageSection = styleSection(filteredContent.vaccineSideEffects);
  const callout: HeadingWithContent | undefined = styleCallout(filteredContent.callout);
  const webpageLink: URL = filteredContent.webpageLink;

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

export { styleSubsection, styleSection, getStyledContentForVaccine, extractHeadingAndContent };
