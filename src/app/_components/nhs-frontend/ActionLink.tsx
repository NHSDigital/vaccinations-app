"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import React, { JSX } from "react";

interface ActionLinkProps {
  url: string;
  displayText: string;
}
type ActionClickEvent = React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>;

const ActionLink = (props: ActionLinkProps): JSX.Element => {
  /* See https://service-manual.nhs.uk/design-system/components/action-link */
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  const handleClick = (e: ActionClickEvent) => {
    if (!hasContextLoaded) return false;
    e.preventDefault(); // prevent default click behaviour
    window.open(props.url, isOpenInMobileApp ? "_self" : "_blank");
  };

  return (
    <div className="nhsuk-action-link">
      <a className="nhsuk-action-link__link" href={props.url} onClick={handleClick}>
        <svg
          className="nhsuk-icon nhsuk-icon__arrow-right-circle"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          width="36"
          height="36"
        >
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"></path>
        </svg>
        <span className="nhsuk-action-link__text">{props.displayText}</span>
      </a>
    </div>
  );
};

export default ActionLink;
