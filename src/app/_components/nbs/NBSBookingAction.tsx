"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import { SSO_TO_NBS_ROUTE } from "@src/app/api/sso-to-nbs/constants";
import { VaccineContentUrlPaths, vaccineTypeToUrlPath } from "@src/models/vaccine";
import { VaccinesWithNBSBookingAvailable } from "@src/services/nbs/nbs-service";
import React, { JSX } from "react";

interface NBSBookingActionForVaccineProps {
  vaccineType: VaccinesWithNBSBookingAvailable;
  displayText: string;
  renderAs: "anchor" | "button" | "actionLink";
}

interface NBSBookingActionForBaseUrlProps {
  url: string; // I wanted a URL here, but something is coercing it to a string, so...
  displayText: string;
  renderAs: "anchor" | "button" | "actionLink";
}

interface NBSBookingActionProps {
  url: string;
  displayText: string;
  renderAs: "anchor" | "button" | "actionLink";
}

type ActionClickEvent = React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>;

const NBSBookingActionForVaccine = ({
  vaccineType,
  displayText,
  renderAs,
}: NBSBookingActionForVaccineProps): JSX.Element => {
  const vaccinePath: VaccineContentUrlPaths = vaccineTypeToUrlPath[vaccineType];
  const nbsSSOLink = `${SSO_TO_NBS_ROUTE}?vaccine=${vaccinePath}`;

  return <NBSBookingAction url={nbsSSOLink} displayText={displayText} renderAs={renderAs} />;
};

const NBSBookingActionForBaseUrl = ({ url, displayText, renderAs }: NBSBookingActionForBaseUrlProps): JSX.Element => {
  const nbsSSOLink = `${SSO_TO_NBS_ROUTE}?redirectTarget=${encodeURI(url)}`;
  return <NBSBookingAction url={nbsSSOLink} displayText={displayText} renderAs={renderAs} />;
};

const NBSBookingAction = ({ url, displayText, renderAs }: NBSBookingActionProps): JSX.Element => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();

  const handleClick = (e: ActionClickEvent) => {
    if (!hasContextLoaded) return false;
    e.preventDefault(); // prevent default click behaviour
    window.open(url, isOpenInMobileApp ? "_self" : "_blank");
  };

  switch (renderAs) {
    case "anchor": {
      return (
        <a href={url} onClick={handleClick}>
          {displayText}
        </a>
      );
    }
    case "button": {
      return (
        <button className={"nhsuk-button nhsapp-button"} onClick={handleClick}>
          {displayText}
        </button>
      );
    }
    case "actionLink": {
      return (
        <div className="nhsuk-action-link">
          <a className="nhsuk-action-link__link" href={url} onClick={handleClick}>
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
            <span className="nhsuk-action-link__text">{displayText}</span>
          </a>
        </div>
      );
    }
  }
};

export { NBSBookingActionForVaccine, NBSBookingActionForBaseUrl };
