import { ComponentPropsWithoutRef, JSX } from "react";
import Markdown from "react-markdown";

interface ComponentClassNames {
  h1?: string | null;
  h2?: string | null;
  h3?: string | null;
  h4?: string | null;
  a?: string | null;
  ul?: string | null;
  ol?: string | null;
  p?: string | null;
}

interface MarkdownProps {
  content: string;
  classNames?: ComponentClassNames;
}

const defaultClassNames = {
  h1: "nhsuk-heading-l",
  h2: "nhsuk-heading-m",
  h3: "nhsuk-heading-s",
  h4: "nhsuk-heading-xs",
  a: "nhsuk-link",
  ul: "nhsuk-list nhsuk-list--bullet",
  ol: "nhsuk-list nhsuk-list--number",
  p: undefined, // No classes by default
};

type H1Props = ComponentPropsWithoutRef<"h1">;
type H2Props = ComponentPropsWithoutRef<"h2">;
type H3Props = ComponentPropsWithoutRef<"h3">;
type H4Props = ComponentPropsWithoutRef<"h4">;
type AProps = ComponentPropsWithoutRef<"a">;
type ULProps = ComponentPropsWithoutRef<"ul">;
type OLProps = ComponentPropsWithoutRef<"ol">;
type PProps = ComponentPropsWithoutRef<"p">;

const MarkdownWithStyling = ({ content, classNames = {} }: MarkdownProps): JSX.Element => {
  const finalClassNames = { ...defaultClassNames, ...classNames };

  return (
    <Markdown
      components={{
        h1: (props) => <H1 {...props} className={finalClassNames.h1 ?? undefined} />,
        h2: (props) => <H2 {...props} className={finalClassNames.h2 ?? undefined} />,
        h3: (props) => <H3 {...props} className={finalClassNames.h3 ?? undefined} />,
        h4: (props) => <H4 {...props} className={finalClassNames.h4 ?? undefined} />,
        a: (props) => <A {...props} className={finalClassNames.a ?? undefined} />,
        ul: (props) => <UL {...props} className={finalClassNames.ul ?? undefined} />,
        ol: (props) => <OL {...props} className={finalClassNames.ol ?? undefined} />,
        p: (props) => <P {...props} className={finalClassNames.p ?? undefined} />,
      }}
    >
      {content}
    </Markdown>
  );
};

const H1 = ({ children, className = defaultClassNames.h1 }: H1Props): JSX.Element => {
  return <h1 className={className ?? undefined}>{children}</h1>;
};

const H2 = ({ children, className = defaultClassNames.h2 }: H2Props): JSX.Element => {
  return <h2 className={className ?? undefined}>{children}</h2>;
};

const H3 = ({ children, className = defaultClassNames.h3 }: H3Props): JSX.Element => {
  return <h3 className={className ?? undefined}>{children}</h3>;
};

const H4 = ({ children, className = defaultClassNames.h4 }: H4Props): JSX.Element => {
  return <h4 className={className ?? undefined}>{children}</h4>;
};

const A = ({ href, children, className = defaultClassNames.a }: AProps): JSX.Element => {
  return (
    <a href={href} className={className ?? undefined} target="_blank" rel="noopener">
      {children}
    </a>
  );
};

const UL = ({ children, className = defaultClassNames.ul }: ULProps): JSX.Element => {
  return <ul className={className ?? undefined}>{children}</ul>;
};

const OL = ({ children, className = defaultClassNames.ol }: OLProps): JSX.Element => {
  return <ol className={className ?? undefined}>{children}</ol>;
};

const P = ({ children, className = defaultClassNames.p }: PProps): JSX.Element => {
  return <p className={className ?? undefined}>{children}</p>;
};

export { MarkdownWithStyling, H1, H2, H3, H4, A, UL, OL, P };
