"use client";

import {
  redirectToNBSBookingPageForVaccine,
  VaccinesWithNBSBookingAvailable,
} from "@src/services/nbs/nbs-service";
import React, { JSX } from "react";

interface NBSBookingButtonProps {
  vaccineType: VaccinesWithNBSBookingAvailable;
}

const NBSBookingButton = ({
  vaccineType,
}: NBSBookingButtonProps): JSX.Element => {
  const handleClick = async () => {
    await redirectToNBSBookingPageForVaccine(vaccineType);
  };

  return (
    <button className={"nhsuk-button nhsapp-button"} onClick={handleClick}>
      Continue to booking
    </button>
  );
};

export { NBSBookingButton };
