import {
  getFilteredContentForVaccine,
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/contentFilterSpike";
import stringToHtml from "@src/utils/stringToHtml";
import InsetText from "@src/app/_components/nhs-frontend/InsetText";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { JSX } from "react";
import { VaccineTypes } from "@src/models/vaccine";

export type StyledPageSection = {
  heading: string;
  component: JSX.Element;
};

export type StyledVaccineContent = {
  overview: string;
  whatVaccineIsFor: StyledPageSection;
  whoVaccineIsFor: StyledPageSection;
  howToGetVaccine: StyledPageSection;
  webpageLink: string;
};

const styleSubsection = (subsection: VaccinePageSubsection, id: number) => {
  let text = subsection.text;
  if (subsection.headline) {
    text = `<h3 key={id}>${subsection.headline}</h3>`.concat(text);
  }
  if (subsection.name === "markdown") {
    return <div key={id} dangerouslySetInnerHTML={stringToHtml(text)} />;
  }
  if (subsection.name === "Information") {
    return <InsetText key={id} content={text} />;
  }
  if (subsection.name === "non-urgent") {
    return <NonUrgentCareCard key={id} content={text} />;
  }
};

const styleSection = (section: VaccinePageSection): StyledPageSection => {
  const heading = section.headline;
  const styledComponent = (
    <>
      {section.subsections.map(
        (subsection: VaccinePageSubsection, index: number) =>
          styleSubsection(subsection, index),
      )}
    </>
  );
  return {
    heading,
    component: styledComponent,
  };
};

const getStyledContentForVaccine = async (
  vaccine: VaccineTypes,
): Promise<StyledVaccineContent> => {
  const filteredContent: VaccinePageContent =
    await getFilteredContentForVaccine(vaccine);
  const overview: string = filteredContent.overview;
  const whatVaccineIsFor: StyledPageSection = styleSection(
    filteredContent.whatVaccineIsFor,
  );
  const whoVaccineIsFor: StyledPageSection = styleSection(
    filteredContent.whoVaccineIsFor,
  );
  const howToGetVaccine: StyledPageSection = styleSection(
    filteredContent.howToGetVaccine,
  );
  const webpageLink: string = filteredContent.webpageLink;

  return {
    overview,
    whatVaccineIsFor,
    whoVaccineIsFor,
    howToGetVaccine,
    webpageLink,
  };
};

export { styleSubsection, styleSection, getStyledContentForVaccine };
