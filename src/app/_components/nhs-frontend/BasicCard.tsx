import { MarkdownWithStyling } from "@src/app/_components/markdown/MarkdownWithStyling";
import { Content } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

interface BasicCardProps {
  content: Content;
}

export const BasicCard = ({ content }: BasicCardProps): JSX.Element => {
  const classNames = {
    h2: "nhsuk-heading-m nhsuk-card__heading",
    h3: "nhsuk-heading-s nhsuk-card__heading",
    p: "nhsuk-card__description",
  };
  const styledContent = <MarkdownWithStyling content={content} classNames={classNames} />;
  return (
    <div className="nhsuk-card">
      <div className="nhsuk-card__content">{styledContent}</div>
    </div>
  );
};
