"use client";

import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import { SSO_TO_NBS_ROUTE } from "@src/app/api/sso-to-nbs/constants";
import { VaccineContentUrlPaths, vaccineTypeToUrlPath } from "@src/models/vaccine";
import { VaccinesWithNBSBookingAvailable } from "@src/services/nbs/nbs-service";
import React, { JSX } from "react";

interface NBSBookingActionForVaccineProps {
  vaccineType: VaccinesWithNBSBookingAvailable;
  displayText: string;
  renderAs: "anchor" | "button";
}

interface NBSBookingActionForBaseUrlProps {
  url: string; // I wanted a URL here, but something is coercing it to a string, so...
  displayText: string;
  renderAs: "anchor" | "button";
}

interface NBSBookingActionProps {
  url: string;
  displayText: string;
  renderAs: "anchor" | "button";
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

  return renderAs === "anchor" ? (
    <a href={url} onClick={handleClick}>
      {displayText}
    </a>
  ) : (
    <button className={"nhsuk-button nhsapp-button"} onClick={handleClick}>
      {displayText}
    </button>
  );
};

export { NBSBookingActionForVaccine, NBSBookingActionForBaseUrl };
