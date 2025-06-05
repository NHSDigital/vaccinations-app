import { AppConfig, configProvider } from "@src/utils/config";
import { VaccineTypes } from "@src/models/vaccine";

type VaccinesWithNBSBookingAvailable = VaccineTypes.RSV;

const nbsVaccinePath: Record<VaccinesWithNBSBookingAvailable, string> = {
  [VaccineTypes.RSV]: "/rsv",
};

const getNBSBookingUrlForVaccine = async (
  vaccineType: VaccinesWithNBSBookingAvailable,
) => {
  const config: AppConfig = await configProvider();

  const nbsURl = new URL(
    `${config.NBS_URL}${config.NBS_BOOKING_PATH}${nbsVaccinePath[vaccineType]}`,
  );
  return nbsURl;
};

export { getNBSBookingUrlForVaccine };
