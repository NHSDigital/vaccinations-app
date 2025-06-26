import Markdown from "react-markdown";
import { ReactNode } from "react";
import { JSX } from "react/jsx-runtime";
import IntrinsicAttributes = JSX.IntrinsicAttributes;

interface MarkdownProps {
  content: string;
}

interface H2Props {
  children: IntrinsicAttributes & ReactNode;
}

const MarkdownWithStyling = ({ content }: MarkdownProps): JSX.Element => {
  return (
    <Markdown
      components={{
        h2: ({ children }) => (children ? <H2>{children}</H2> : undefined),
      }}
    >
      {content}
    </Markdown>
  );
};

const H2 = ({ children }: H2Props): JSX.Element => {
  return <h2 className="nhsuk-heading-s">{children}</h2>;
};

export { MarkdownWithStyling, H2 };
