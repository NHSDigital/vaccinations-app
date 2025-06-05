import { auth } from "@project/auth";
import { SESSION_TIMEOUT_ROUTE } from "@src/app/session-timeout/constants";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ name: "middleware" });

export async function middleware(request: NextRequest) {
  log.info(`Inspecting ${request.nextUrl}`);
  const session: Session | null = await auth();
  log.info(session, "Session Object");
  if (!session?.user) {
    return NextResponse.redirect(new URL(SESSION_TIMEOUT_ROUTE, request.url));
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
     * /favicon.ico (exclude the favicon path)
     * /nhsuk-frontend-9.1.0 (exclude nhsuk assets)
     * /_next/* (exclude Next.js assets, e.g., /_next/static/*)
     */
    "/((?!api/auth|api/sso|session-logout|session-timeout|sso-failure|favicon.ico|nhsuk-frontend-9.1.0|_next/).*)",
  ],
};
