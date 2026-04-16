import { ContentParsingError } from "@src/services/content-api/parsers/custom/exceptions";
import { VaccinePageSubsection } from "@src/services/content-api/types";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "services-content-api-parsers-custom-extract-html" });

const paragraphsRegExp: RegExp = /<p>.*?<\/p>/g;

const parseSubSectionMatches = (
  subsection: VaccinePageSubsection,
  sectionHeadingRegEx: RegExp,
): { heading: string; paragraphs: string[] } => {
  if (subsection.type !== "simpleElement") {
    log.warn({ context: { type: subsection.type } }, "HowToGetSubsection element not found");
    throw new ContentParsingError("HowToGetSubsection element not found");
  }

  const sectionMatches = sectionHeadingRegEx.exec(subsection.text);
  if (!sectionMatches) {
    log.warn({ context: { text: subsection.text } }, "HowToGetSubsection header not found - has the content changed?");
    throw new ContentParsingError("HowToGetSubsection header not found - has the content changed?");
  }

  const [fullMatch, capturedContent] = sectionMatches;

  const paragraphsMatches = capturedContent.match(paragraphsRegExp);
  if (!paragraphsMatches) {
    log.warn(
      { context: { text: capturedContent } },
      "HowToGetSubsection paragraph not found - has the content changed?",
    );
    throw new ContentParsingError("HowToGetSubsection paragraph not found - has the content changed?");
  }
  const heading = fullMatch.slice(0, -capturedContent.length);
  return { heading, paragraphs: paragraphsMatches };
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
  const { heading, paragraphs } = parseSubSectionMatches(subsection, sectionHeadingRegEx);
  return `${heading}${paragraphs.join("")}`;
};
