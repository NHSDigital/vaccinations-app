import { JSX } from "react";

interface ContentsListProps {
  urlsWithContents: Record<string, string>[];
}

const ContentsList = (props: ContentsListProps): JSX.Element => {
  return (
    <nav className="nhsuk-contents-list" role="navigation" aria-label="Pages in this guide">
      <h2 className="nhsuk-u-visually-hidden">Contents</h2>
      <ol className="nhsuk-contents-list__list">
        {props.urlsWithContents.map((item: Record<string, string>, index: number) => {
          const urlPath = Object.keys(item)[0];
          return (
            <li className="nhsuk-contents-list__item" key={index}>
              <a href={`#${urlPath}`} className="nhsuk-contents-list__link">
                {item[urlPath]}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ContentsList;
