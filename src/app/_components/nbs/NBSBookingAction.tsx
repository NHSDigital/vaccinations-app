"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import ActionLink from "@src/app/_components/nhs-frontend/ActionLink";
import { SSO_TO_NBS_ROUTE } from "@src/app/api/sso-to-nbs/constants";
import { VaccineContentUrlPaths, vaccineTypeToUrlPath } from "@src/models/vaccine";
import { VaccinesWithNBSBookingAvailable } from "@src/services/nbs/nbs-service";
import React, { JSX } from "react";

type RenderOptions = "anchor" | "button" | "actionLink";

interface NBSBookingActionForVaccineProps {
  vaccineType: VaccinesWithNBSBookingAvailable;
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
  const vaccinePath: VaccineContentUrlPaths = vaccineTypeToUrlPath[vaccineType];
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

  const testHandleClick = (e: ActionClickEvent) => {
    if (!hasContextLoaded) return false;
    e.preventDefault(); // prevent default click behaviour
    const url = `${SSO_TO_NBS_ROUTE}?redirectTarget=${encodeURI("https://f.nhswebsite-integration.nhs.uk/nbs/nhs-app/flu")}`;
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
        <>
          <button className={className} onClick={handleClick}>
            {displayText}
          </button>{" "}
          {/* TODO: For testing overlays in app, delete when done */}
          <button className={className} onClick={testHandleClick}>
            Test should not open in overlay
          </button>
        </>
      );
    }
    case "actionLink": {
      return <ActionLink url={url} displayText={displayText} />;
    }
  }
};

export { NBSBookingActionForVaccine, NBSBookingActionForBaseUrl };
