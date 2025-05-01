import { auth, signIn } from "@project/auth";
import { NHS_LOGIN_PROVIDER_ID } from "@src/app/api/auth/[...nextauth]/provider";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@src/utils/logger";

const log = logger.child({ name: "middleware" });
const ASSERTED_LOGIN_IDENTITY_PARAM = "assertedLoginIdentity";

const doSSO = async (request: NextRequest): Promise<NextResponse> => {
  const assertedLoginIdentity: string | null = request.nextUrl.searchParams.get(
    ASSERTED_LOGIN_IDENTITY_PARAM,
  );

  if (assertedLoginIdentity) {
    const redirectUrl = await signIn(
      NHS_LOGIN_PROVIDER_ID,
      {
        redirectUrl: request.url,
        redirect: false,
      },
      { asserted_login_identity: assertedLoginIdentity },
    );
    log.info(`signIn wants to redirect to: ${redirectUrl}`);
    return NextResponse.redirect(redirectUrl);
  } else {
    log.warn("SSO without assertedLoginIdentity parameter");
    return NextResponse.redirect(
      `${request.nextUrl.origin}/sso-failure?error=Parameter not found: ${ASSERTED_LOGIN_IDENTITY_PARAM}`,
    );
  }
};

export async function middleware(request: NextRequest) {
  log.info(`Inspecting ${request.nextUrl}`);
  const session: Session | null = await auth();
  if (!session?.expires) {
    try {
      return await doSSO(request);
    } catch (error) {
      log.error(error);
      return NextResponse.redirect(
        `${request.nextUrl.origin}/sso-failure?error=${error}`,
      );
    }
  }
  log.info(session, "Session Object");
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
    "/((?!api/auth|sso-failure|favicon.ico|nhsuk-frontend-9.1.0|_next/static|_next/image).*)",
  ],
};
