import { ComponentPropsWithoutRef } from "react";
import Markdown from "react-markdown";
import { JSX } from "react/jsx-runtime";

interface ComponentClassNames {
  h2?: string;
  a?: string;
  ul?: string;
  ol?: string;
  p?: string;
}

interface MarkdownProps {
  content: string;
  classNames?: ComponentClassNames;
}

const defaultClassNames: Required<ComponentClassNames> = {
  h2: "nhsuk-heading-s",
  a: "nhsuk-link",
  ul: "nhsuk-list nhsuk-list--bullet",
  ol: "nhsuk-list nhsuk-list--number",
  p: "nhsuk-body",
};

type H2Props = ComponentPropsWithoutRef<"h2">;
type AProps = ComponentPropsWithoutRef<"a">;
type ULProps = ComponentPropsWithoutRef<"ul">;
type OLProps = ComponentPropsWithoutRef<"ol">;
type PProps = ComponentPropsWithoutRef<"p">;

// SECTION: Main Component

const MarkdownWithStyling = ({ content, classNames = {} }: MarkdownProps): JSX.Element => {
  // Merge the user-provided classNames with the defaults
  const finalClassNames = { ...defaultClassNames, ...classNames };

  return (
    <Markdown
      components={{
        h2: (props) => <H2 {...props} className={finalClassNames.h2} />,
        a: (props) => <A {...props} className={finalClassNames.a} />,
        ul: (props) => <UL {...props} className={finalClassNames.ul} />,
        ol: (props) => <OL {...props} className={finalClassNames.ol} />,
        p: (props) => <P {...props} className={finalClassNames.p} />,
      }}
    >
      {content}
    </Markdown>
  );
};

const H2 = ({ children, className = defaultClassNames.h2 }: H2Props): JSX.Element => {
  return <h2 className={className}>{children}</h2>;
};

const A = ({ href, children, className = defaultClassNames.a }: AProps): JSX.Element => {
  return (
    <a href={href} className={className} target="_blank" rel="noopener">
      {children}
    </a>
  );
};

const UL = ({ children, className = defaultClassNames.ul }: ULProps): JSX.Element => {
  return <ul className={className}>{children}</ul>;
};

const OL = ({ children, className = defaultClassNames.ol }: OLProps): JSX.Element => {
  return <ol className={className}>{children}</ol>;
};

const P = ({ children, className = defaultClassNames.p }: PProps): JSX.Element => {
  return <p className={className}>{children}</p>;
};

export { MarkdownWithStyling, H2, A, UL, OL, P };
