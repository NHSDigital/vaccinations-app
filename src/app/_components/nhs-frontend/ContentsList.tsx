import { JSX } from "react";

interface ContentsListProps {
  contents: string[];
}

const ContentsList = (props: ContentsListProps): JSX.Element => {
  return (
    <nav className="nhsuk-contents-list" role="navigation" aria-label="Pages in this guide">
      <h2 className="nhsuk-u-visually-hidden">Contents</h2>
      <ol className="nhsuk-contents-list__list">
        {props.contents.map((contentItem: string, index: number) => (
          <li className="nhsuk-contents-list__item" key={index}>
            <span className="nhsuk-contents-list__link">{contentItem}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ContentsList;
