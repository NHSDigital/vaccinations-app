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
  let redirectUrl: string;

  if (request.nextUrl.searchParams.has(REDIRECT_TARGET_PARAM)) {
    const nbsURl = new URL(decodeURI(request.nextUrl.searchParams.get(REDIRECT_TARGET_PARAM) ?? ""));
    const nbsQueryParams = await getNbsQueryParams(); //TODO: VIA-328 SB - try/catch around here.
    nbsQueryParams.forEach((param) => {
      nbsURl.searchParams.append(param.name, param.value);
    });
    redirect(nbsURl.href);
  } else {
    //TODO: VIA-328 SB - Do we want only the redirect target version above?
    const vaccine: string | null = request.nextUrl.searchParams.get(VACCINE_PARAM);
    const vaccineType: VaccineTypes | undefined = vaccine ? getVaccineTypeFromUrlPath(vaccine) : undefined;

    if (vaccine && vaccineType) {
      try {
        redirectUrl = await getSSOUrlToNBSForVaccine(vaccineType);
      } catch (error) {
        log.error(error, "Error getting redirect url to NBS");
        redirectUrl = SSO_FAILURE_ROUTE;
      }
      redirect(redirectUrl);
    } else {
      log.warn("SSO to NBS but without a valid vaccine parameter - %s", vaccine);
      notFound();
    }
  }
};
