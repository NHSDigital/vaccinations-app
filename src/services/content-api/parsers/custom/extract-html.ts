import { ContentParsingError } from "@src/services/content-api/parsers/custom/exceptions";
import { VaccinePageSubsection } from "@src/services/content-api/types";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "services-content-api-parsers-custom-extract-html" });

const paragraphsRegExp: RegExp = /<p>.*?<\/p>/g;

export const extractHtmlFromSubSectionByHeading = (
  subsection: VaccinePageSubsection,
  sectionHeadingRegEx: RegExp,
): string => {
  if (subsection.type !== "simpleElement") {
    log.warn({ context: { type: subsection.type } }, "HowToGetSubsection element not found");
    throw new ContentParsingError("HowToGetSubsection element not found");
  }

  const howToGetSectionMatches = sectionHeadingRegEx.exec(subsection.text);
  if (!howToGetSectionMatches) {
    log.warn({ context: { text: subsection.text } }, "HowToGetSubsection header not found - has the content changed?");
    throw new ContentParsingError("HowToGetSubsection header not found - has the content changed?");
  }

  const paragraphsMatches = howToGetSectionMatches[1].match(paragraphsRegExp);
  if (!paragraphsMatches) {
    log.warn(
      { context: { text: howToGetSectionMatches[1] } },
      "HowToGetSubsection paragraph not found - has the content changed?",
    );
    throw new ContentParsingError("HowToGetSubsection paragraph not found - has the content changed?");
  }

  return paragraphsMatches.join("");
};
