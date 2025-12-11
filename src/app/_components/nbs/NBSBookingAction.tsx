"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import { SSO_TO_NBS_ROUTE } from "@src/app/api/sso-to-nbs/constants";
import { UrlPathFragment, VaccineInfo, VaccineType } from "@src/models/vaccine";
import { ActionLink } from "nhsuk-react-components";
import React, { JSX } from "react";

type RenderOptions = "anchor" | "button" | "actionLink";

interface NBSBookingActionForVaccineProps {
  vaccineType: VaccineType;
  displayText: string;
  renderAs: RenderOptions;
  reduceBottomPadding: boolean;
}

interface NBSBookingActionForBaseUrlProps {
  url: string; // I wanted a URL here, but something is coercing it to a string, so...
  displayText: string;
  renderAs: RenderOptions;
  reduceBottomPadding: boolean;
}

interface NBSBookingActionProps {
  url: string;
  displayText: string;
  renderAs: RenderOptions;
  reduceBottomPadding: boolean;
}

type ActionClickEvent = React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>;

const NBSBookingActionForVaccine = ({
  vaccineType,
  displayText,
  renderAs,
  reduceBottomPadding = false,
}: NBSBookingActionForVaccineProps): JSX.Element => {
  const vaccinePath: UrlPathFragment = VaccineInfo[vaccineType].nbsPath;
  const nbsSSOLink = `${SSO_TO_NBS_ROUTE}?vaccine=${vaccinePath}`;

  return (
    <NBSBookingAction
      url={nbsSSOLink}
      displayText={displayText}
      renderAs={renderAs}
      reduceBottomPadding={reduceBottomPadding}
    />
  );
};

const NBSBookingActionForBaseUrl = ({
  url,
  displayText,
  renderAs,
  reduceBottomPadding = false,
}: NBSBookingActionForBaseUrlProps): JSX.Element => {
  const nbsSSOLink = `${SSO_TO_NBS_ROUTE}?redirectTarget=${encodeURI(url)}`;
  return (
    <NBSBookingAction
      url={nbsSSOLink}
      displayText={displayText}
      renderAs={renderAs}
      reduceBottomPadding={reduceBottomPadding}
    />
  );
};

const NBSBookingAction = ({
  url,
  displayText,
  renderAs,
  reduceBottomPadding = false,
}: NBSBookingActionProps): JSX.Element => {
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
      const className = `nhsuk-button nhsapp-button${reduceBottomPadding ? " nhsuk-u-margin-bottom-2" : ""}`;
      return (
        <button className={className} onClick={handleClick}>
          {displayText}
        </button>
      );
    }
    case "actionLink": {
      // Ref: https://main--65aa76b29d00a047fe683b95.chromatic.com/?path=/docs/navigation-actionlink--docs
      return (
        <ActionLink asElement={"a"} rel="noopener" target={"_blank"} href={url} onClick={handleClick}>
          {displayText}
        </ActionLink>
      );
    }
  }
};

export { NBSBookingActionForVaccine, NBSBookingActionForBaseUrl };
