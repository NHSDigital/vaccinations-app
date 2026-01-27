import { MarkdownWithStyling } from "@project/src/app/_components/markdown/MarkdownWithStyling";
import EmergencyCareCard from "@src/app/_components/nhs-frontend/EmergencyCareCard";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import UrgentCareCard from "@src/app/_components/nhs-frontend/UrgentCareCard";
import { VaccineType } from "@src/models/vaccine";
import { styleHowToGetSectionForRsv } from "@src/services/content-api/parsers/custom/rsv";
import { styleHowToGetSectionForRsvPregnancy } from "@src/services/content-api/parsers/custom/rsv-pregnancy";
import {
  HeadingLevel,
  HeadingWithContent,
  HeadingWithTypedContent,
  Overview,
  StyledPageSection,
  StyledVaccineContent,
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";
import { linksOpenCorrectly } from "@src/utils/html";
import sanitiseHtml from "@src/utils/sanitise-html";
import { InsetText, WarningCallout } from "nhsuk-react-components";
import React, { JSX } from "react";

import styles from "./styles.module.css";

enum SubsectionTypes {
  INFORMATION = "INFORMATION",
  NON_URGENT = "NON_URGENT",
  URGENT = "URGENT",
  CALLOUT = "CALLOUT",
  EMERGENCY = "EMERGENCY",
  COMMON_CONTENT = "COMMON_CONTENT",
}

const Subsections: Record<SubsectionTypes, string> = {
  [SubsectionTypes.INFORMATION]: "Information",
  [SubsectionTypes.NON_URGENT]: "non-urgent",
  [SubsectionTypes.URGENT]: "urgent",
  [SubsectionTypes.EMERGENCY]: "immediate",
  [SubsectionTypes.CALLOUT]: "Callout",
  [SubsectionTypes.COMMON_CONTENT]: "Common Content",
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
        className={`${styles.zeroMarginBottomTable}`}
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

  if (subsection.name === Subsections.INFORMATION || subsection.name === Subsections.COMMON_CONTENT) {
    return <InsetText key={id}>{_getDivWithSanitisedHtml(text)}</InsetText>;
  } else if (subsection.name === Subsections.NON_URGENT) {
    const { heading, headingLevel, content } = extractHeadingAndContent(subsection.text);
    return (
      <NonUrgentCareCard
        key={id}
        heading={_getDivWithSanitisedHtml(heading)}
        headingLevel={headingLevel}
        content={_getDivWithSanitisedHtml(content)}
      />
    );
  } else if (subsection.name === Subsections.URGENT) {
    const { heading, headingLevel, content } = extractHeadingAndContent(subsection.text);
    return (
      <UrgentCareCard
        key={id}
        heading={_getDivWithSanitisedHtml(heading)}
        headingLevel={headingLevel}
        content={_getDivWithSanitisedHtml(content)}
      />
    );
  } else if (subsection.name === Subsections.EMERGENCY) {
    const { heading, headingLevel, content } = extractHeadingAndContent(subsection.text);
    return (
      <EmergencyCareCard
        key={id}
        heading={_getDivWithSanitisedHtml(heading)}
        headingLevel={headingLevel}
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
  const pattern: RegExp = /^<(h\d)>(.*?)<\/h\d>/;
  const match: RegExpMatchArray | null = pattern.exec(text);

  if (match) {
    const firstCaptureGroup: HeadingLevel = match[1] as HeadingLevel;
    const secondCaptureGroup: string = match[2];
    const remainingText: string = text.replace(pattern, "").trim();

    return { heading: secondCaptureGroup, headingLevel: firstCaptureGroup, content: remainingText };
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

function styleCallout(callout: HeadingWithTypedContent | undefined): StyledPageSection | undefined {
  if (callout) {
    switch (callout?.contentType) {
      case "markdown":
        return {
          heading: callout.heading,
          component: <MarkdownWithStyling content={callout.content} delineator={false} />,
        };
      case "html":
        return {
          heading: callout.heading,
          component: (
            <div
              data-testid="callout-html"
              dangerouslySetInnerHTML={{ __html: linksOpenCorrectly(callout.content) || "" }}
            />
          ),
        };
      case "string":
        return {
          heading: callout.heading,
          component: (
            <div data-testid="callout-string">
              <p>{callout.content}</p>
            </div>
          ),
        };
    }
  }
  return undefined;
}

function styleRecommendation(recommendation: HeadingWithContent | undefined): StyledPageSection | undefined {
  if (recommendation) {
    return {
      heading: recommendation.heading,
      component: <MarkdownWithStyling content={recommendation.content} delineator={false} />,
    };
  }
  return undefined;
}

const getStyledContentForVaccine = async (
  vaccine: VaccineType,
  filteredContent: VaccinePageContent,
  fragile: boolean,
): Promise<StyledVaccineContent> => {
  const overview: Overview | undefined = filteredContent.overview;
  const callout: StyledPageSection | undefined = styleCallout(filteredContent.callout);
  let additionalInformation: StyledPageSection | undefined;
  if (filteredContent.additionalInformation) {
    additionalInformation = styleSection(filteredContent.additionalInformation);
  }
  const recommendation: StyledPageSection | undefined = styleRecommendation(filteredContent.recommendation);
  const overviewConclusion: Overview | undefined = filteredContent.overviewConclusion;
  const actions = filteredContent.actions;
  const preOpenActions = filteredContent.preOpenActions;
  let whatVaccineIsFor;
  if (filteredContent.whatVaccineIsFor) {
    whatVaccineIsFor = styleSection(filteredContent.whatVaccineIsFor);
  }
  const whoVaccineIsFor: StyledPageSection = styleSection(filteredContent.whoVaccineIsFor);
  const howToGetVaccine: StyledPageSection = styleHowToGetSection(vaccine, filteredContent.howToGetVaccine, fragile);
  const vaccineSideEffects: StyledPageSection = styleSection(filteredContent.vaccineSideEffects);
  const webpageLink: URL = filteredContent.webpageLink;

  return {
    overview,
    callout,
    additionalInformation,
    recommendation,
    actions,
    preOpenActions,
    overviewConclusion,
    whatVaccineIsFor,
    whoVaccineIsFor,
    howToGetVaccine,
    vaccineSideEffects,
    webpageLink,
  };
};

export { styleSubsection, styleSection, getStyledContentForVaccine, extractHeadingAndContent, styleCallout };
