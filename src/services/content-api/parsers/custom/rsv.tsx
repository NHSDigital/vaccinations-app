import type {
  StyledPageSection,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";
import sanitiseHtml from "@src/utils/sanitise-html";
import React from "react";

const styleHowToGetSubsection = (
  subsection: VaccinePageSubsection,
  index: number,
) => {
  if (subsection.type !== "simpleElement") {
    return <></>;
  }

  const match = subsection.text.match(
    /<h3>If you're aged 75 to 79<\/h3>((?:\s*<p>.*?<\/p>)+)/i,
  );

  if (match) {
    const paragraphs = match[1].match(/<p>.*?<\/p>/g);
    return (
      paragraphs && (
        <div
          key={index}
          dangerouslySetInnerHTML={{
            __html: sanitiseHtml(paragraphs.join("\n")),
          }}
        />
      )
    );
  } else {
    return <></>;
  }
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
