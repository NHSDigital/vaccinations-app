import { auth } from "@project/auth";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@src/utils/logger";

const log = logger.child({ name: "middleware" });

export async function middleware(request: NextRequest) {
  const session: Session | null = await auth();
  if (!session?.user) {
    log.info(`${request.nextUrl}`);
    log.error("Auth session not found");
    return NextResponse.redirect(
      `${request.nextUrl.origin}/sso/failure?message=no-session-found`,
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all pages except:
     * 1. /api/auth (exclude all NextAuth routes)
     * 2. /sso (exclude the SSO routes)
     * 3. /_next/* (exclude Next.js assets, e.g., /_next/static/*)
     * 4. /favicon.ico (exclude the favicon path)
     * 5. /nhsuk-frontend-9.1.0 (exclude nhsuk js)
     */
    "/((?!api/auth|sso|favicon.ico|nhsuk-frontend-9.1.0|_next/static|_next/image).*)",
  ],
};
