"use client";

import { SSO_TO_NBS_ROUTE } from "@src/app/api/sso-to-nbs/constants";
import {
  VaccineContentUrlPaths,
  vaccineTypeToUrlPath,
} from "@src/models/vaccine";
import { VaccinesWithNBSBookingAvailable } from "@src/services/nbs/nbs-service";
import React, { JSX, useEffect, useState } from "react";

interface NBSBookingButtonProps {
  vaccineType: VaccinesWithNBSBookingAvailable;
}

const NBSBookingButton = ({
  vaccineType,
}: NBSBookingButtonProps): JSX.Element => {
  const [isOpenInNHSApp, setIsOpenInNHSApp] = useState(true);
  const vaccinePath: VaccineContentUrlPaths = vaccineTypeToUrlPath[vaccineType];

  useEffect(() => {
    if (window.nhsapp.tools.isOpenInNHSApp()) {
      setIsOpenInNHSApp(true);
    } else {
      setIsOpenInNHSApp(false);
    }
  }, []);

  const handleClick = () => {
    window.open(
      `${SSO_TO_NBS_ROUTE}?vaccine=${vaccinePath}`,
      isOpenInNHSApp ? "_self" : "_blank",
    );
  };

  return (
    <button className={"nhsuk-button nhsapp-button"} onClick={handleClick}>
      Continue to booking
    </button>
  );
};

export { NBSBookingButton };
