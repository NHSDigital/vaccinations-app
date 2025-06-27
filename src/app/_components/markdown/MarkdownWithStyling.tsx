import Markdown from "react-markdown";
import { HTMLAttributes, ReactNode } from "react";
import { JSX } from "react/jsx-runtime";
import { Element } from "hast";

interface MarkdownProps {
  content: string;
}

interface H2Props extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

const allowedHtmlTagsSet = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "b",
  "strong",
  "em",
  "i",
  "a",
  "ul",
  "ol",
  "li",
]);

const MarkdownWithStyling = ({ content }: MarkdownProps): JSX.Element => {
  return (
    <Markdown
      components={{
        h2: H2,
      }}
      allowElement={allowHTMLElement}
    >
      {content}
    </Markdown>
  );
};

const H2 = ({ children }: H2Props): JSX.Element => {
  return <h2 className="nhsuk-heading-s">{children}</h2>;
};

const allowHTMLElement = (element: Element) => {
  return allowedHtmlTagsSet.has(element.tagName);
};

export { MarkdownWithStyling, H2, allowHTMLElement };
