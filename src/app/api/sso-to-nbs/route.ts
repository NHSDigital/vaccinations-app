import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { VaccineTypes } from "@src/models/vaccine";
import { getSSOUrlToNBSForVaccine } from "@src/services/nbs/nbs-service";
import { logger } from "@src/utils/logger";
import { getVaccineTypeFromUrlPath } from "@src/utils/path";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

const log = logger.child({ name: "api-sso-to-nbs" });
const VACCINE_PARAM = "vaccine";

export const GET = async (request: NextRequest) => {
  const vaccine: string | null = request.nextUrl.searchParams.get(VACCINE_PARAM);
  const vaccineType: VaccineTypes | undefined = vaccine ? getVaccineTypeFromUrlPath(vaccine) : undefined;

  let redirectUrl: string;
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
};
