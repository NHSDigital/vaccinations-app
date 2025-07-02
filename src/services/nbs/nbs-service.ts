"use server";

import { AppConfig, configProvider } from "@src/utils/config";
import { VaccineTypes } from "@src/models/vaccine";
import { generateAssertedLoginIdentityJwt } from "@src/utils/auth/generate-auth-payload";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { Logger } from "pino";
import { logger } from "@src/utils/logger";

const log: Logger = logger.child({ module: "nbs-service" });

const NBS_QUERY_PARAMS = {
  CAMPAIGN_ID: "wt.mc_id",
  ASSERTED_LOGIN_IDENTITY: "assertedLoginIdentity",
};

const PLACEHOLDER_CAMPAIGN_ID = "vita-RSV-booking";

export type VaccinesWithNBSBookingAvailable = VaccineTypes.RSV | VaccineTypes.RSV_PREGNANCY;

const nbsVaccinePath: Record<VaccinesWithNBSBookingAvailable, string> = {
  [VaccineTypes.RSV]: "/rsv",
  [VaccineTypes.RSV_PREGNANCY]: "/rsv",
};

const getSSOUrlToNBSForVaccine = async (vaccineType: VaccinesWithNBSBookingAvailable) => {
  const config: AppConfig = await configProvider();

  let redirectUrl;
  try {
    const assertedLoginIdentityJWT = await generateAssertedLoginIdentityJwt(config);

    const nbsURl = new URL(`${config.NBS_URL}${config.NBS_BOOKING_PATH}${nbsVaccinePath[vaccineType]}`);
    nbsURl.searchParams.set(NBS_QUERY_PARAMS.CAMPAIGN_ID, PLACEHOLDER_CAMPAIGN_ID);
    nbsURl.searchParams.set(NBS_QUERY_PARAMS.ASSERTED_LOGIN_IDENTITY, assertedLoginIdentityJWT);
    redirectUrl = nbsURl.toString();
  } catch (error) {
    log.error(error, "Error redirecting to NBS");
    redirectUrl = SSO_FAILURE_ROUTE;
  }

  return redirectUrl;
};

export { getSSOUrlToNBSForVaccine };
