import Markdown from "react-markdown";
import { HTMLAttributes, ReactNode } from "react";
import { JSX } from "react/jsx-runtime";

interface MarkdownProps {
  content: string;
}

interface H2Props extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

const MarkdownWithStyling = ({ content }: MarkdownProps): JSX.Element => {
  return (
    <Markdown
      components={{
        h2: H2,
      }}
    >
      {content}
    </Markdown>
  );
};

const H2 = ({ children, ...props }: H2Props): JSX.Element => {
  return (
    <h2 className="nhsuk-heading-s" {...props}>
      {children}
    </h2>
  );
};

export { MarkdownWithStyling, H2 };
