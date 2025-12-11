"use server";

import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { generateAssertedLoginIdentityJwt } from "@src/utils/auth/generate-auth-payload";
import config from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "nbs-service" });

const NBS_QUERY_PARAMS = {
  CAMPAIGN_ID: "wt.mc_id",
  ASSERTED_LOGIN_IDENTITY: "assertedLoginIdentity",
};

export async function buildNbsUrl(vaccineType: VaccineType) {
  const nbsBaseUrl = await config.NBS_URL;
  const nbsBookingPath = await config.NBS_BOOKING_PATH;
  return new URL(`${nbsBaseUrl.pathname}${nbsBookingPath}/${VaccineInfo[vaccineType].nbsPath}`, nbsBaseUrl.origin);
}

export async function buildNbsUrlWithQueryParams(vaccineType: VaccineType) {
  const nbsURl = await buildNbsUrl(vaccineType);
  const nbsQueryParams = await getNbsQueryParams(vaccineType);
  nbsQueryParams.forEach((param) => {
    nbsURl.searchParams.append(param.name, param.value);
  });
  return nbsURl;
}

const getSSOUrlToNBSForVaccine = async (vaccineType: VaccineType) => {
  let redirectUrl;
  try {
    const nbsURl = await buildNbsUrlWithQueryParams(vaccineType);
    redirectUrl = nbsURl.href;
  } catch (error) {
    log.error(error, "Error redirecting to NBS");
    redirectUrl = SSO_FAILURE_ROUTE;
  }

  return redirectUrl;
};

const getNbsQueryParams = async (vaccineType: VaccineType | undefined) => {
  const assertedLoginIdentityJWT = await generateAssertedLoginIdentityJwt();

  return [
    { name: NBS_QUERY_PARAMS.CAMPAIGN_ID, value: vaccineType ? VaccineInfo[vaccineType].nbsCampaign : "unknown" },
    { name: NBS_QUERY_PARAMS.ASSERTED_LOGIN_IDENTITY, value: assertedLoginIdentityJWT },
  ];
};

export { getSSOUrlToNBSForVaccine, getNbsQueryParams };
