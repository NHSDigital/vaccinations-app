import Markdown from "react-markdown";
import { ComponentPropsWithoutRef } from "react";
import { JSX } from "react/jsx-runtime";

interface MarkdownProps {
  content: string;
}

type H2Props = ComponentPropsWithoutRef<"h2">;
type AProps = ComponentPropsWithoutRef<"a">;
type ULProps = ComponentPropsWithoutRef<"ul">;
type OLProps = ComponentPropsWithoutRef<"ol">;

const MarkdownWithStyling = ({ content }: MarkdownProps): JSX.Element => {
  return (
    <Markdown
      components={{
        h2: H2,
        a: A,
        ul: UL,
        ol: OL,
      }}
    >
      {content}
    </Markdown>
  );
};

const H2 = ({ children }: H2Props): JSX.Element => {
  return <h2 className="nhsuk-heading-s">{children}</h2>;
};

const A = ({ href, children }: AProps): JSX.Element => {
  return (
    <a href={href} className="nhsuk-link" target="_blank" rel="noopener">
      {children}
    </a>
  );
};

const UL = ({ children }: ULProps): JSX.Element => {
  return <ul className="nhsuk-list nhsuk-list--bullet">{children}</ul>;
};

const OL = ({ children }: OLProps): JSX.Element => {
  return <ol className="nhsuk-list nhsuk-list--number">{children}</ol>;
};

export { MarkdownWithStyling, H2, A, UL, OL };
