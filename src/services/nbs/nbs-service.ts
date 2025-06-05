import { AppConfig, configProvider } from "@src/utils/config";
import { VaccineTypes } from "@src/models/vaccine";
import { getAssertedLoginIdentityJWT } from "@src/utils/auth/sso-methods";

const NBS_QUERY_PARAMS = {
  CAMPAIGN_ID: "wt.mc_id",
  ASSERTED_LOGIN_IDENTITY: "assertedLoginIdentity",
};

const PLACEHOLDER_CAMPAIGN_ID = "vita-RSV-booking";

type VaccinesWithNBSBookingAvailable = VaccineTypes.RSV;

const nbsVaccinePath: Record<VaccinesWithNBSBookingAvailable, string> = {
  [VaccineTypes.RSV]: "/rsv",
};

const getNBSBookingUrlForVaccine = async (
  vaccineType: VaccinesWithNBSBookingAvailable,
) => {
  const config: AppConfig = await configProvider();

  const assertedLoginIdentityJWT = getAssertedLoginIdentityJWT();

  const nbsURl = new URL(
    `${config.NBS_URL}${config.NBS_BOOKING_PATH}${nbsVaccinePath[vaccineType]}`,
  );
  nbsURl.searchParams.set(
    NBS_QUERY_PARAMS.CAMPAIGN_ID,
    PLACEHOLDER_CAMPAIGN_ID,
  );
  nbsURl.searchParams.set(
    NBS_QUERY_PARAMS.ASSERTED_LOGIN_IDENTITY,
    assertedLoginIdentityJWT,
  );
  return nbsURl;
};

export { getNBSBookingUrlForVaccine };
