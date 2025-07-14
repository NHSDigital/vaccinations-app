"use client";

import { SSO_TO_NBS_ROUTE } from "@src/app/api/sso-to-nbs/constants";
import { VaccineContentUrlPaths, vaccineTypeToUrlPath } from "@src/models/vaccine";
import { VaccinesWithNBSBookingAvailable } from "@src/services/nbs/nbs-service";
import React, { JSX, useEffect, useState } from "react";

interface NBSBookingActionForVaccineProps {
  vaccineType: VaccinesWithNBSBookingAvailable;
  displayText: string;
  renderAs: "anchor" | "button";
}

interface NBSBookingAction {
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

const NBSBookingAction = ({ url, displayText, renderAs }: NBSBookingAction): JSX.Element => {
  const [isOpenInNHSApp, setIsOpenInNHSApp] = useState(true);

  useEffect(() => {
    if (window.nhsapp.tools.isOpenInNHSApp()) {
      setIsOpenInNHSApp(true);
    } else {
      setIsOpenInNHSApp(false);
    }
  }, []);

  const handleClick = (e: ActionClickEvent) => {
    e.preventDefault(); // prevent default click behaviour
    window.open(url, isOpenInNHSApp ? "_self" : "_blank");
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

export { NBSBookingActionForVaccine };
