import { NBSBookingActionForVaccine } from "@src/app/_components/nbs/NBSBookingAction";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import React, { JSX } from "react";

type PharmacyBookingProps = {
  vaccineType: VaccineTypes;
};

const PharmacyBookingInfo = ({ vaccineType }: PharmacyBookingProps): JSX.Element => {
  return (
    <p data-testid="pharmacy-booking-info">
      {"In some areas you can also "}
      <NBSBookingActionForVaccine
        displayText={`book an ${VaccineInfo[vaccineType].displayName.midSentenceCase} vaccination in a pharmacy`}
        vaccineType={vaccineType}
        renderAs={"anchor"}
      />
      .
    </p>
  );
};

export { PharmacyBookingInfo };
