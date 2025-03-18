import {
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/contentFilterSpike";
import stringToHtml from "@src/utils/stringToHtml";
import InsetText from "@src/app/_components/nhs-frontend/InsetText";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";

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

const styleSection = (section: VaccinePageSection) => {
  return (
    <div>
      <h2>{section.headline}</h2>
      {section.subsections.map(
        (subsection: VaccinePageSubsection, index: number) =>
          styleSubsection(subsection, index),
      )}
    </div>
  );
};

export { styleSubsection, styleSection };
