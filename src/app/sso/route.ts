import { signIn } from "@project/auth";
import { NHS_LOGIN_PROVIDER_ID } from "@src/app/api/auth/[...nextauth]/provider";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "sso-route" });

export async function GET(request: NextRequest) {
  const assertedLoginIdentity: string | null = request.nextUrl.searchParams.get(
    "assertedLoginIdentity",
  );

  if (assertedLoginIdentity) {
    await signIn(
      NHS_LOGIN_PROVIDER_ID,
      { redirectTo: `${process.env.VACCINATION_APP_URL}` },
      { asserted_login_identity: assertedLoginIdentity },
    );
  } else {
    log.error("SSO route called without assertedLoginIdentity parameter");
    log.info(`SSO Url: ${request.nextUrl}`);

    return NextResponse.redirect(
      `${request.nextUrl.origin}/sso/failure?message=no-assertedLoginIdentity-parameter-found`,
    );
  }
}
