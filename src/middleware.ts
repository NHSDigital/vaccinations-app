import { auth } from "@project/auth";
import lazyConfig from "@src/utils/lazy-config";
import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { extractRequestContextFromHeaders } from "@src/utils/requestScopedStorageWrapper";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "middleware" });
const MiddlewarePerformanceMarker = "middleware";

export async function middleware(request: NextRequest) {
  const requestContext: RequestContext = extractRequestContextFromHeaders(request?.headers);

  return await asyncLocalStorage.run(requestContext, () => middlewareWrapper(request));
}

const middlewareWrapper = async (request: NextRequest) => {
  profilePerformanceStart(MiddlewarePerformanceMarker);
  log.info({ context: { nextUrl: request.nextUrl.href } }, "Inspecting request");

  // Add URL to request headers to make available for logging in the nodejs layer
  const headers = new Headers(request.headers);
  headers.set("nextUrl", request.nextUrl.href);

  let response: NextResponse;
  const session: Session | null = await auth();
  if (!session?.user) {
    log.info({ context: { nextUrl: request.nextUrl.href } }, "Missing user session, redirecting to login");
    response = NextResponse.redirect((await lazyConfig.NHS_APP_REDIRECT_LOGIN_URL) as URL);
    response.headers.set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
  } else {
    response = NextResponse.next({
      request: { headers: headers },
    });
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
    "/((?!api/auth|api/sso|api/fake-login|session-logout|session-timeout|sso-failure|service-failure|favicon.ico|assets|js|css|_next).*)",
  ],
};
