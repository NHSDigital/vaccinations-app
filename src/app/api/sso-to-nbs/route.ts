import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { VaccineTypes } from "@src/models/vaccine";
import { getNbsQueryParams, getSSOUrlToNBSForVaccine } from "@src/services/nbs/nbs-service";
import { logger } from "@src/utils/logger";
import { getVaccineTypeFromUrlPath } from "@src/utils/path";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

const log = logger.child({ name: "api-sso-to-nbs" });
const VACCINE_PARAM = "vaccine";
const REDIRECT_TARGET_PARAM = "redirectTarget";

export const GET = async (request: NextRequest) => {
  let shouldReturnNotFound = false;
  let finalRedirectUrl: string = "";

  if (request.nextUrl.searchParams.has(REDIRECT_TARGET_PARAM)) {
    const rawRedirectTarget = request.nextUrl.searchParams.get(REDIRECT_TARGET_PARAM);
    ({ finalRedirectUrl, shouldReturnNotFound } = await getGivenRedirectTarget(rawRedirectTarget));
  } else {
    const vaccine: string | null = request.nextUrl.searchParams.get(VACCINE_PARAM);
    ({ finalRedirectUrl, shouldReturnNotFound } = await getGivenVaccine(vaccine));
  }

  if (shouldReturnNotFound) {
    notFound();
  } else redirect(finalRedirectUrl);
};

async function getGivenRedirectTarget(rawRedirectTarget: string | null) {
  let shouldReturnNotFound = false;
  let finalRedirectUrl: string = "";

  if (rawRedirectTarget) {
    try {
      const nbsURl = new URL(decodeURI(rawRedirectTarget ?? ""));
      try {
        const nbsQueryParams = await getNbsQueryParams();
        nbsQueryParams.forEach((param) => {
          nbsURl.searchParams.append(param.name, param.value);
        });
        finalRedirectUrl = nbsURl.href;
      } catch (error) {
        log.error({ REDIRECT_TARGET_PARAM, rawRedirectTarget, error }, "Error getting redirect url to NBS");
        finalRedirectUrl = SSO_FAILURE_ROUTE;
      }
    } catch (error) {
      log.warn({ error, rawRedirectTarget }, "SSO to NBS but with invalid redirectTarget parameter");
      shouldReturnNotFound = true;
    }
  } else {
    log.warn({ rawRedirectTarget }, "SSO to NBS but without a valid redirectTarget parameter");
    shouldReturnNotFound = true;
  }
  return { finalRedirectUrl, shouldReturnNotFound };
}

async function getGivenVaccine(vaccine: string | null) {
  let shouldReturnNotFound = false;
  let finalRedirectUrl: string = "";
  const vaccineType: VaccineTypes | undefined = vaccine ? getVaccineTypeFromUrlPath(vaccine) : undefined;

  if (vaccine && vaccineType) {
    try {
      finalRedirectUrl = await getSSOUrlToNBSForVaccine(vaccineType);
    } catch (error) {
      log.error({ VACCINE_PARAM, vaccine, error }, "Error getting redirect url to NBS");
      finalRedirectUrl = SSO_FAILURE_ROUTE;
    }
  } else {
    log.warn({ vaccine }, "SSO to NBS but without a valid vaccine parameter");
    shouldReturnNotFound = true;
  }
  return { finalRedirectUrl, shouldReturnNotFound };
}
