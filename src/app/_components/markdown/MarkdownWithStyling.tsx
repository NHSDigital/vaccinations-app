import { ComponentPropsWithoutRef, JSX } from "react";
import Markdown from "react-markdown";

// --- SECTION: Type Definitions ---

interface ComponentClassNames {
  h2?: string | null;
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
  h2: "nhsuk-heading-s",
  a: "nhsuk-link",
  ul: "nhsuk-list nhsuk-list--bullet",
  ol: "nhsuk-list nhsuk-list--number",
  p: undefined,
};

type H2Props = ComponentPropsWithoutRef<"h2">;
type AProps = ComponentPropsWithoutRef<"a">;
type ULProps = ComponentPropsWithoutRef<"ul">;
type OLProps = ComponentPropsWithoutRef<"ol">;
type PProps = ComponentPropsWithoutRef<"p">;

const MarkdownWithStyling = ({ content, classNames = {} }: MarkdownProps): JSX.Element => {
  const finalClassNames = { ...defaultClassNames, ...classNames };

  return (
    <Markdown
      components={{
        h2: (props) => <H2 {...props} className={finalClassNames.h2 ?? undefined} />,
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

const H2 = ({ children, className = defaultClassNames.h2 }: H2Props): JSX.Element => {
  return <h2 className={className ?? undefined}>{children}</h2>;
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

export { MarkdownWithStyling, H2, A, UL, OL, P };
