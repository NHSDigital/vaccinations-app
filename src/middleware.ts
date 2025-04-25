import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@src/utils/auth/session";
import { logger } from "@src/utils/logger";

const log = logger.child({ name: "middleware" });

export async function middleware(request: NextRequest) {
  const sessionCookie = await getSession();
  logger.info(sessionCookie, "session");

  if (!sessionCookie || !sessionCookie.access_token) {
    log.error("Session cookie not found");
    return NextResponse.redirect(`${request.nextUrl.origin}/sso-error`);
  }

  try {
    return NextResponse.next();
  } catch (error) {
    log.error(error, "Error occurred during redirection");
    return NextResponse.redirect(`${request.nextUrl.origin}/sso-error`);
  }
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all pages except:
     * 1. /api/* (exclude all API routes)
     * 2. /sso/* (exclude sso route used for initiating auth flow)
     * 2. /login (exclude the login page)
     * 3. /_next/* (exclude Next.js assets, e.g., /_next/static/*)
     */
    "/((?!api|sso|_next/static|_next/image).*)",
  ],
};
