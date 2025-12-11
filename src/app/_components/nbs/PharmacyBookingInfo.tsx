import { NBSBookingActionForVaccine } from "@src/app/_components/nbs/NBSBookingAction";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import React, { JSX } from "react";

type PharmacyBookingProps = {
  vaccineType: VaccineType;
};

const PharmacyBookingInfo = ({ vaccineType }: PharmacyBookingProps): JSX.Element => {
  const vaccineInfo = VaccineInfo[vaccineType];

  return (
    <p data-testid="pharmacy-booking-info">
      {vaccineInfo.forOlderAdults ? "In some areas you can " : "In some areas you can also "}
      <NBSBookingActionForVaccine
        displayText={`book ${vaccineInfo.displayName.indefiniteArticle} ${vaccineInfo.displayName.midSentenceCase} vaccination in a pharmacy`}
        vaccineType={vaccineType}
        renderAs={"anchor"}
        reduceBottomPadding={false}
      />
      {vaccineInfo.forOlderAdults ? ". This pharmacy service is only for adults aged 75 to 79." : "."}
    </p>
  );
};

export { PharmacyBookingInfo };
