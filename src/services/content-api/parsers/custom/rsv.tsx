import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import { VaccineType } from "@src/models/vaccine";
import { ContentParsingError } from "@src/services/content-api/parsers/custom/exceptions";
import type { StyledPageSection, VaccinePageSection, VaccinePageSubsection } from "@src/services/content-api/types";
import { logger } from "@src/utils/logger";
import sanitiseHtml from "@src/utils/sanitise-html";
import { Logger } from "pino";
import React from "react";

const log: Logger = logger.child({ module: "services-content-api-parsers-custom-rsv" });

const olderAdultsRegExp: RegExp = /<h3>If you're aged \d+ or over<\/h3>((?:\s*<p>.*?<\/p>)+)/i;
const olderAdultsInCareHomeRegExp: RegExp =
  /<h3>If you live in a care home for older adults<\/h3>((?:\s*<p>.*?<\/p>)+)/i;

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

  const olderAdultsInCareHomeMatches = olderAdultsInCareHomeRegExp.exec(subsection.text);
  if (!olderAdultsInCareHomeMatches) {
    log.warn(
      { context: { text: subsection.text } },
      "HowToGetSubsection care home header not found - has the content changed?",
    );
    if (fragile) {
      throw new ContentParsingError("HowToGetSubsection care home header not found - has the content changed?");
    } else {
      return <></>;
    }
  }

  return (
    <div key={index}>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitiseHtml(olderAdultsMatches[0]),
        }}
      />
      <PharmacyBookingInfo vaccineType={VaccineType.RSV} />
      <div
        dangerouslySetInnerHTML={{
          __html: sanitiseHtml(olderAdultsInCareHomeMatches[0]),
        }}
      />
    </div>
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
