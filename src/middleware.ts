import { auth } from "@project/auth";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "middleware" });

export async function middleware(request: NextRequest) {
  log.info(`Inspecting ${request.nextUrl}`);
  const config: AppConfig = await configProvider();

  const session: Session | null = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL(config.NHS_APP_REDIRECT_LOGIN_URL));
  }

  return NextResponse.next();
}

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
