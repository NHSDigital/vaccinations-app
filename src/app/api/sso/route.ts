import { signIn } from "@project/auth";
import { NHS_LOGIN_PROVIDER_ID } from "@src/app/api/auth/[...nextauth]/provider";
import { logger } from "@src/utils/logger";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const log = logger.child({ name: "api-sso" });
const ASSERTED_LOGIN_IDENTITY_PARAM = "assertedLoginIdentity";

export const GET = async (request: NextRequest) => {
  const assertedLoginIdentity: string | null = request.nextUrl.searchParams.get(
    ASSERTED_LOGIN_IDENTITY_PARAM
  );

  if (assertedLoginIdentity) {
    let redirectUrl: string | undefined;
    let errorString: string | undefined;
    try {
      redirectUrl = await signIn(
        NHS_LOGIN_PROVIDER_ID,
        { redirect: false },
        { asserted_login_identity: assertedLoginIdentity }
      );
    } catch (error) {
      errorString = `${error}`;
      log.error(error);
    }
    redirect(redirectUrl ?? `/sso-failure?error=${errorString}`);
  } else {
    log.warn("SSO without assertedLoginIdentity parameter");
    redirect(`/sso-failure?error=Parameter not found: ${ASSERTED_LOGIN_IDENTITY_PARAM}`);
  }
};
