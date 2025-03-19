import { VaccinePageSubsection } from "@src/services/content-api/contentFilterSpike";
import stringToHtml from "@src/utils/stringToHtml";
import InsetText from "@src/app/_components/nhs-frontend/InsetText";
import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";

const styleSubsection = (subsection: VaccinePageSubsection) => {
  let text = subsection.text;
  if (subsection.headline) {
    text = `<h3>${subsection.headline}</h3>`.concat(text);
  }
  if (subsection.name === "markdown") {
    return <div dangerouslySetInnerHTML={stringToHtml(text)} />;
  }
  if (subsection.name === "Information") {
    return <InsetText content={text} />;
  }
  if (subsection.name === "non-urgent") {
    return <NonUrgentCareCard content={text} />;
  }
};
export { styleSubsection };
