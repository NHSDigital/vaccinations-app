"use server";

import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { VaccineType } from "@src/models/vaccine";
import { generateAssertedLoginIdentityJwt } from "@src/utils/auth/generate-auth-payload";
import config from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "nbs-service" });

const NBS_QUERY_PARAMS = {
  CAMPAIGN_ID: "wt.mc_id",
  ASSERTED_LOGIN_IDENTITY: "assertedLoginIdentity",
};

const PLACEHOLDER_CAMPAIGN_ID = "vita-RSV-booking";

export type VaccinesWithNBSBookingAvailable = VaccineType.RSV | VaccineType.RSV_PREGNANCY;

const nbsVaccinePath: Record<VaccinesWithNBSBookingAvailable, string> = {
  [VaccineType.RSV]: "/rsv",
  [VaccineType.RSV_PREGNANCY]: "/rsv",
};

const getSSOUrlToNBSForVaccine = async (vaccineType: VaccinesWithNBSBookingAvailable) => {
  let redirectUrl;
  try {
    const nbsBaseUrl = await config.NBS_URL;
    const nbsBookingPath = await config.NBS_BOOKING_PATH;
    const nbsURl = new URL(`${nbsBaseUrl.pathname}${nbsBookingPath}${nbsVaccinePath[vaccineType]}`, nbsBaseUrl.origin);
    const nbsQueryParams = await getNbsQueryParams();
    nbsQueryParams.forEach((param) => {
      nbsURl.searchParams.append(param.name, param.value);
    });
    redirectUrl = nbsURl.toString();
  } catch (error) {
    log.error(error, "Error redirecting to NBS");
    redirectUrl = SSO_FAILURE_ROUTE;
  }

  return redirectUrl;
};

const getNbsQueryParams = async () => {
  const assertedLoginIdentityJWT = await generateAssertedLoginIdentityJwt();

  return [
    { name: NBS_QUERY_PARAMS.CAMPAIGN_ID, value: PLACEHOLDER_CAMPAIGN_ID },
    { name: NBS_QUERY_PARAMS.ASSERTED_LOGIN_IDENTITY, value: assertedLoginIdentityJWT },
  ];
};

export { getSSOUrlToNBSForVaccine, getNbsQueryParams };
