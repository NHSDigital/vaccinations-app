import { ContentParsingError } from "@src/services/content-api/parsers/custom/exceptions";
import type { StyledPageSection, VaccinePageSection, VaccinePageSubsection } from "@src/services/content-api/types";
import { logger } from "@src/utils/logger";
import sanitiseHtml from "@src/utils/sanitise-html";
import { Logger } from "pino";
import React from "react";

const log: Logger = logger.child({ module: "services-content-api-parsers-custom-rsv" });

const olderAdultsRegExp: RegExp =
  /<h3>If you're aged \d+ to \d+(?: \(or turned \d+ after .*\))?<\/h3>((?:\s*<p>.*?<\/p>)+)/i;
const paragraphsRegExp: RegExp = /<p>.*?<\/p>/g;

export const styleHowToGetSubsection = (subsection: VaccinePageSubsection, index: number, fragile: boolean) => {
  if (subsection.type !== "simpleElement") {
    log.warn({ context: { type: subsection.type } }, "HowToGetSubsection element not found");
    if (fragile) {
      throw new ContentParsingError("HowToGetSubsection element not found");
    } else {
      return <></>;
    }
  }

  const olderAdultsMatches = olderAdultsRegExp.exec(subsection.text);
  if (!olderAdultsMatches) {
    log.warn({ context: { text: subsection.text } }, "HowToGetSubsection header not found - has the content changed?");
    if (fragile) {
      throw new ContentParsingError("HowToGetSubsection header not found - has the content changed?");
    } else {
      return <></>;
    }
  }

  const paragraphsMatches = olderAdultsMatches[1].match(paragraphsRegExp);
  if (!paragraphsMatches) {
    log.warn(
      { context: { text: olderAdultsMatches[1] } },
      "HowToGetSubsection paragraph not found - has the content changed?",
    );
    if (fragile) {
      throw new ContentParsingError("HowToGetSubsection paragraph not found - has the content changed?");
    } else {
      return <></>;
    }
  }

  return (
    <div
      key={index}
      dangerouslySetInnerHTML={{
        __html: sanitiseHtml(paragraphsMatches.join("")),
      }}
    />
  );
};

export const styleHowToGetSectionForRsv = (section: VaccinePageSection, fragile: boolean): StyledPageSection => {
  const heading = section.headline;
  const styledComponent = (
    <>
      {section.subsections.map((subsection: VaccinePageSubsection, index: number) =>
        styleHowToGetSubsection(subsection, index, fragile),
      )}
    </>
  );
  return {
    heading,
    component: styledComponent,
  };
};
