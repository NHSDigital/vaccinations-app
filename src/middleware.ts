import { auth } from "@project/auth";
import { AppConfig, configProvider } from "@src/utils/config";
import { extractRootTraceIdFromAmznTraceId, logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "middleware" });
const MiddlewarePerformanceMarker = "middleware";

export async function middleware(request: NextRequest) {
  const requestContext: RequestContext = {
    traceId:
      extractRootTraceIdFromAmznTraceId(request?.headers?.get("X-Amzn-Trace-Id") ?? "") ?? "undefined-request-id",
  };

  return await asyncLocalStorage.run(requestContext, () => middlewareWrapper(request));
}

const middlewareWrapper = async (request: NextRequest) => {
  profilePerformanceStart(MiddlewarePerformanceMarker);
  log.info({ context: { nextUrl: request.nextUrl } }, "Inspecting request");
  const config: AppConfig = await configProvider();

  let response: NextResponse;
  const session: Session | null = await auth();
  if (!session?.user) {
    response = NextResponse.redirect(new URL(config.NHS_APP_REDIRECT_LOGIN_URL));
  } else {
    response = NextResponse.next();
  }

  profilePerformanceEnd(MiddlewarePerformanceMarker);
  return response;
};

export const config = {
  matcher: [
    /*
      Apply middleware to all pages except:
      * /api/auth (exclude all NextAuth routes)
      * /api/sso (exclude sso jump off routes)
      * /session-logout (exclude session logout route)
      * /session-timeout (exclude session timeout route)
      * /sso-failure (exclude the SSO routes)
      * /service-failure (exclude the service failure routes)
      * /favicon.ico
      * /assets (exclude the assets like icons)
      * /js (exclude bundled javascript)
      * /css (exclude bundled style sheets)
      * /_next/* (exclude Next.js assets, e.g., /_next/static/*)
      */
    "/((?!api/auth|api/sso|session-logout|session-timeout|sso-failure|service-failure|favicon.ico|assets|js|css|_next).*)",
  ],
};
