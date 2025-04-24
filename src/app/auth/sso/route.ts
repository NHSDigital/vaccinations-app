import { NextRequest, NextResponse } from "next/server";
import { logger } from "@src/utils/logger";
import { getClientConfig } from "@src/utils/auth/get-client-config";
import { getAuthConfig } from "@src/utils/auth/get-auth-config";
import * as client from "openid-client";

const log = logger.child({ module: "sso-route" });

export async function GET(request: NextRequest) {
  console.log(request);
  const assertedLoginIdentity = request.nextUrl.searchParams.get(
    "assertedLoginIdentity",
  );
  if (!assertedLoginIdentity) {
    log.error("SSO route called without assertedLoginIdentity parameter");
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
  try {
    const state = client.randomState();
    const authConfig = await getAuthConfig();
    const clientConfig = await getClientConfig();
    const parameters: Record<string, string> = {
      redirect_uri: authConfig.redirect_uri,
      scope: authConfig.scope,
      state: state,
      prompt: "none",
      asserted_login_identity: assertedLoginIdentity,
    };
    const redirectTo = client.buildAuthorizationUrl(clientConfig, parameters);
    // TODO: Save state to session so it can be reused in the /token call in /auth/callback route

    return NextResponse.redirect(redirectTo);
  } catch (e) {
    log.error(e, "SSO route: error handling not-yet-implemented");
    throw new Error("not-yet-implemented");
  }
}
