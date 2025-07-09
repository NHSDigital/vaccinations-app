import type { StyledPageSection, VaccinePageSection, VaccinePageSubsection } from "@src/services/content-api/types";
import sanitiseHtml from "@src/utils/sanitise-html";
import React from "react";

const rsvInPregnancyRegExp: RegExp = /<h3>If you're pregnant<\/h3>((?:\s*<p>.*?<\/p>)+)/i;
const paragraphsRegExp: RegExp = /<p>.*?<\/p>/g;

export const styleHowToGetSubsection = (subsection: VaccinePageSubsection, index: number) => {
  if (subsection.type !== "simpleElement") {
    return <></>;
  }

  const rsvInPregnancyMatches = rsvInPregnancyRegExp.exec(subsection.text);
  if (!rsvInPregnancyMatches) return <></>;

  const paragraphsMatches = rsvInPregnancyMatches[1].match(paragraphsRegExp);
  if (!paragraphsMatches) return <></>;

  return (
    <div key={index}>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitiseHtml(paragraphsMatches.join("")),
        }}
      />
    </div>
  );
};

export const styleHowToGetSectionForRsvPregnancy = (section: VaccinePageSection): StyledPageSection => {
  const heading = section.headline;
  const styledComponent = (
    <>
      {section.subsections.map((subsection: VaccinePageSubsection, index: number) =>
        styleHowToGetSubsection(subsection, index),
      )}
    </>
  );
  return {
    heading,
    component: styledComponent,
  };
};
