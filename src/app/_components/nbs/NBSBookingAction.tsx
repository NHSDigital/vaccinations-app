"use client";

import { SSO_TO_NBS_ROUTE } from "@src/app/api/sso-to-nbs/constants";
import {
  VaccineContentUrlPaths,
  vaccineTypeToUrlPath,
} from "@src/models/vaccine";
import { VaccinesWithNBSBookingAvailable } from "@src/services/nbs/nbs-service";
import React, { JSX, useEffect, useState } from "react";

interface NBSBookingActionProps {
  vaccineType: VaccinesWithNBSBookingAvailable;
  displayText: string;
  renderAs: "anchor" | "button";
}

type ActionClickEvent =
  | React.MouseEvent<HTMLAnchorElement>
  | React.MouseEvent<HTMLButtonElement>;

const NBSBookingAction = ({
  vaccineType,
  displayText,
  renderAs,
}: NBSBookingActionProps): JSX.Element => {
  const [isOpenInNHSApp, setIsOpenInNHSApp] = useState(true);
  const vaccinePath: VaccineContentUrlPaths = vaccineTypeToUrlPath[vaccineType];
  const nbsSSOLink = `${SSO_TO_NBS_ROUTE}?vaccine=${vaccinePath}`;

  useEffect(() => {
    if (window.nhsapp.tools.isOpenInNHSApp()) {
      setIsOpenInNHSApp(true);
    } else {
      setIsOpenInNHSApp(false);
    }
  }, []);

  const handleClick = (e: ActionClickEvent) => {
    e.preventDefault(); // prevent default click behaviour
    window.open(nbsSSOLink, isOpenInNHSApp ? "_self" : "_blank");
  };

  return renderAs === "anchor" ? (
    <a href={nbsSSOLink} onClick={handleClick}>
      {displayText}
    </a>
  ) : (
    <button className={"nhsuk-button nhsapp-button"} onClick={handleClick}>
      {displayText}
    </button>
  );
};

export { NBSBookingAction };
