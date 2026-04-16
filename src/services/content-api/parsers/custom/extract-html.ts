import { ContentParsingError } from "@src/services/content-api/parsers/custom/exceptions";
import { VaccinePageSubsection } from "@src/services/content-api/types";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "services-content-api-parsers-custom-extract-html" });

const paragraphsRegExp: RegExp = /<p>.*?<\/p>/g;

const parseSubSectionMatches = (
  subsection: VaccinePageSubsection,
  sectionHeadingRegEx: RegExp,
): { fullMatch: string; capturedContent: string; paragraphs: string[] } => {
  if (subsection.type !== "simpleElement") {
    log.warn({ context: { type: subsection.type } }, "HowToGetSubsection element not found");
    throw new ContentParsingError("HowToGetSubsection element not found");
  }

  const sectionMatches = sectionHeadingRegEx.exec(subsection.text);
  if (!sectionMatches) {
    log.warn({ context: { text: subsection.text } }, "HowToGetSubsection header not found - has the content changed?");
    throw new ContentParsingError("HowToGetSubsection header not found - has the content changed?");
  }

  const paragraphsMatches = sectionMatches[1].match(paragraphsRegExp);
  if (!paragraphsMatches) {
    log.warn(
      { context: { text: sectionMatches[1] } },
      "HowToGetSubsection paragraph not found - has the content changed?",
    );
    throw new ContentParsingError("HowToGetSubsection paragraph not found - has the content changed?");
  }

  return { fullMatch: sectionMatches[0], capturedContent: sectionMatches[1], paragraphs: paragraphsMatches };
};

export const extractHtmlFromSubSectionByHeading = (
  subsection: VaccinePageSubsection,
  sectionHeadingRegEx: RegExp,
): string => {
  const { paragraphs } = parseSubSectionMatches(subsection, sectionHeadingRegEx);
  return paragraphs.join("");
};

export const extractHtmlWithHeadingFromSubSectionByHeading = (
  subsection: VaccinePageSubsection,
  sectionHeadingRegEx: RegExp,
): string => {
  const { fullMatch, capturedContent, paragraphs } = parseSubSectionMatches(subsection, sectionHeadingRegEx);
  const headingHtml = fullMatch.slice(0, fullMatch.length - capturedContent.length);
  return `${headingHtml}${paragraphs.join("")}`;
};
