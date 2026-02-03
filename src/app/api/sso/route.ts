import { signIn } from "@project/auth";
import { NHS_LOGIN_PROVIDER_ID } from "@src/app/api/auth/[...nextauth]/provider";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { extractRequestContextFromHeadersAndCookies } from "@src/utils/requestScopedStorageWrapper";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const log = logger.child({ module: "api-sso" });
const ASSERTED_LOGIN_IDENTITY_PARAM = "assertedLoginIdentity";
const ApiSSOPerformanceMarker = "api-sso";

export const GET = async (request: NextRequest) => {
  const requestContext: RequestContext = extractRequestContextFromHeadersAndCookies(request?.headers, request?.cookies);

  await asyncLocalStorage.run(requestContext, async () => {
    log.info("SSO route invoked");
    const assertedLoginIdentity: string | null = request.nextUrl.searchParams.get(ASSERTED_LOGIN_IDENTITY_PARAM);

    const sessionId = crypto.randomUUID();
    const config: AppConfig = await configProvider();
    const MAX_SESSION_AGE_MILLISECONDS: number = config.MAX_SESSION_AGE_MINUTES * 60 * 1000;

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

      const cookieStore = await cookies();
      cookieStore.set("__Host-Http-session-id", sessionId, {
        expires: Date.now() + MAX_SESSION_AGE_MILLISECONDS,
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
      });

      redirect(redirectUrl ?? SSO_FAILURE_ROUTE);
    } else {
      log.warn("SSO route called without assertedLoginIdentity parameter");
      redirect(SSO_FAILURE_ROUTE);
    }
  });
};
