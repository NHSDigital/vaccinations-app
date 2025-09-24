import { JSX, useState } from "react";

interface ContentsListProps {
  contents: string[];
}

const ContentsList = (props: ContentsListProps): JSX.Element => {
  const [clickedItem, setClickedItem] = useState("");

  function handleClick(item: string) {
    setClickedItem(item);
  }

  return (
    <nav className="nhsuk-contents-list" role="navigation" aria-label="Pages in this guide">
      <h2 className="nhsuk-u-visually-hidden">Contents</h2>
      <ol className="nhsuk-contents-list__list">
        {props.contents.map((contentItem: string, index: number) =>
          clickedItem === contentItem ? (
            <li
              className="nhsuk-contents-list__item"
              key={index}
              aria-current="page"
              onClick={() => handleClick(contentItem)}
              onKeyDown={() => handleClick}
            >
              <span className="nhsuk-contents-list__link__current">{contentItem}</span>
            </li>
          ) : (
            <li
              className="nhsuk-contents-list__item"
              key={index}
              onClick={() => handleClick(contentItem)}
              onKeyDown={() => handleClick}
            >
              <a href={`#${contentItem.toLowerCase()}`} className="nhsuk-contents-list__link">
                {contentItem}
              </a>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
};

export default ContentsList;
