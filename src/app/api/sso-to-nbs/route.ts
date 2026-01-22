import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { VaccineType } from "@src/models/vaccine";
import { getNbsQueryParams, getSSOUrlToNBSForVaccine } from "@src/services/nbs/nbs-service";
import { logger } from "@src/utils/logger";
import { getVaccineTypeFromLowercaseString } from "@src/utils/path";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { extractRequestContextFromHeadersAndCookies } from "@src/utils/requestScopedStorageWrapper";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

const log = logger.child({ module: "api-sso-to-nbs" });
const VACCINE_PARAM = "vaccine";
const REDIRECT_TARGET_PARAM = "redirectTarget";
const ApiSSONBSPerformanceMarker = "api-sso-nbs";

export const GET = async (request: NextRequest) => {
  const requestContext: RequestContext = extractRequestContextFromHeadersAndCookies(request?.headers, request?.cookies);
  await asyncLocalStorage.run(requestContext, async () => {
    log.info("SSO-to-NBS jump off route invoked");
    let shouldReturnNotFound: boolean;
    let finalRedirectUrl: string;

    profilePerformanceStart(ApiSSONBSPerformanceMarker);

    const vaccine: string | null = request.nextUrl.searchParams.get(VACCINE_PARAM);
    if (request.nextUrl.searchParams.has(REDIRECT_TARGET_PARAM)) {
      const rawRedirectTarget = request.nextUrl.searchParams.get(REDIRECT_TARGET_PARAM);
      ({ finalRedirectUrl, shouldReturnNotFound } = await getGivenRedirectTarget(rawRedirectTarget, vaccine));
    } else {
      ({ finalRedirectUrl, shouldReturnNotFound } = await getGivenVaccine(vaccine));
    }

    profilePerformanceEnd(ApiSSONBSPerformanceMarker);

    if (shouldReturnNotFound) {
      log.info("SSO-to-NBS route returning 404 not found - see warning level logs for additional context");
      notFound();
    } else {
      log.info("NBS SSO setup successful; Redirecting user to NBS");
      redirect(finalRedirectUrl);
    }
  });
};

async function getGivenRedirectTarget(rawRedirectTarget: string | null, vaccine: string | null) {
  log.debug({ rawRedirectTarget }, "getGivenRedirectTarget");
  let shouldReturnNotFound = false;
  let finalRedirectUrl: string = "";
  const vaccineType: VaccineType | undefined = vaccine ? getVaccineTypeFromLowercaseString(vaccine) : undefined;

  if (rawRedirectTarget) {
    try {
      const nbsURl = new URL(decodeURI(rawRedirectTarget ?? ""));
      try {
        const nbsQueryParams = await getNbsQueryParams(vaccineType);
        nbsQueryParams.forEach((param) => {
          nbsURl.searchParams.append(param.name, param.value);
        });
        finalRedirectUrl = nbsURl.href;
      } catch (error) {
        log.error(
          { context: { REDIRECT_TARGET_PARAM, rawRedirectTarget }, error },
          "Error building redirect url for NBS",
        );
        finalRedirectUrl = SSO_FAILURE_ROUTE;
      }
    } catch (error) {
      log.warn(
        { error: error, context: { rawRedirectTarget } },
        "SSO to NBS but with invalid redirectTarget parameter",
      );
      shouldReturnNotFound = true;
    }
  } else {
    log.warn({ context: { rawRedirectTarget } }, "SSO to NBS but without a valid redirectTarget parameter");
    shouldReturnNotFound = true;
  }
  return { finalRedirectUrl, shouldReturnNotFound };
}

async function getGivenVaccine(vaccine: string | null) {
  log.debug({ vaccine }, "getGivenVaccine");
  let shouldReturnNotFound = false;
  let finalRedirectUrl: string = "";
  const vaccineType: VaccineType | undefined = vaccine ? getVaccineTypeFromLowercaseString(vaccine) : undefined;

  log.debug({ vaccineType }, "getGivenVaccine");
  if (vaccine && vaccineType) {
    try {
      finalRedirectUrl = await getSSOUrlToNBSForVaccine(vaccineType);
    } catch (error) {
      log.error({ error: error, context: { VACCINE_PARAM, vaccine } }, "Error getting redirect url to NBS");
      finalRedirectUrl = SSO_FAILURE_ROUTE;
    }
  } else {
    log.warn({ context: { vaccine } }, "SSO to NBS but without a valid vaccine parameter");
    shouldReturnNotFound = true;
  }
  return { finalRedirectUrl, shouldReturnNotFound };
}
