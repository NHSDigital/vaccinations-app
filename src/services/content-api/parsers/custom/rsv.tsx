import type {
  StyledPageSection,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";
import sanitiseHtml from "@src/utils/sanitise-html";
import React from "react";

const olderAdultsRegExp: RegExp =
  /<h3>If you're aged 75 to 79<\/h3>((?:\s*<p>.*?<\/p>)+)/i;
const paragraphsRegExp: RegExp = /<p>.*?<\/p>/g;

export const styleHowToGetSubsection = (
  subsection: VaccinePageSubsection,
  index: number,
) => {
  if (subsection.type !== "simpleElement") {
    return <></>;
  }

  const olderAdultsMatches = olderAdultsRegExp.exec(subsection.text);
  if (!olderAdultsMatches) return <></>;

  const paragraphsMatches = olderAdultsMatches[1].match(paragraphsRegExp);
  if (!paragraphsMatches) return <></>;

  return (
    <div
      key={index}
      dangerouslySetInnerHTML={{
        __html: sanitiseHtml(paragraphsMatches.join("")),
      }}
    />
  );
};

export const styleHowToGetSectionForRsv = (
  section: VaccinePageSection,
): StyledPageSection => {
  const heading = section.headline;
  const styledComponent = (
    <>
      {section.subsections.map(
        (subsection: VaccinePageSubsection, index: number) =>
          styleHowToGetSubsection(subsection, index),
      )}
    </>
  );
  return {
    heading,
    component: styledComponent,
  };
};
