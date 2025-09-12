import { signIn } from "@project/auth";
import { NHS_LOGIN_PROVIDER_ID } from "@src/app/api/auth/[...nextauth]/provider";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { extractRequestContextFromHeaders } from "@src/utils/requestScopedStorageWrapper";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const log = logger.child({ name: "api-sso" });
const ASSERTED_LOGIN_IDENTITY_PARAM = "assertedLoginIdentity";
const ApiSSOPerformanceMarker = "api-sso";

export const GET = async (request: NextRequest) => {
  const requestContext: RequestContext = extractRequestContextFromHeaders(request?.headers);

  await asyncLocalStorage.run(requestContext, async () => {
    const assertedLoginIdentity: string | null = request.nextUrl.searchParams.get(ASSERTED_LOGIN_IDENTITY_PARAM);

    if (assertedLoginIdentity) {
      let redirectUrl: string | undefined;
      try {
        profilePerformanceStart(ApiSSOPerformanceMarker);
        redirectUrl = await signIn(
          NHS_LOGIN_PROVIDER_ID,
          { redirect: false },
          { asserted_login_identity: assertedLoginIdentity },
        );
        profilePerformanceEnd(ApiSSOPerformanceMarker);
      } catch (error) {
        log.error(error);
      }
      redirect(redirectUrl ?? SSO_FAILURE_ROUTE);
    } else {
      log.warn("SSO without assertedLoginIdentity parameter");
      redirect(SSO_FAILURE_ROUTE);
    }
  });
};
