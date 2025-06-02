import { auth } from "@project/auth";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
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
    return NextResponse.redirect(new URL(SESSION_LOGOUT_ROUTE, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all pages except:
     * 1. /api/auth (exclude all NextAuth routes)
     * 2. /sso-failure (exclude the SSO routes)
     * 3. /session-logout (exclude session logout route)
     * 4. /_next/* (exclude Next.js assets, e.g., /_next/static/*)
     * 5. /favicon.ico (exclude the favicon path)
     * 6. /nhsuk-frontend-9.1.0 (exclude nhsuk js)
     */
    "/((?!api/auth|api/sso|session-logout|sso-failure|favicon.ico|nhsuk-frontend-9.1.0|_next/static|_next/image).*)",
  ],
};
