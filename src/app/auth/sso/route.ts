import { NextRequest, NextResponse } from "next/server";
import { logger } from "@src/utils/logger";
import { getClientConfig } from "@src/utils/auth/get-client-config";
import { getAuthConfig } from "@src/utils/auth/get-auth-config";
import * as client from "openid-client";

const log = logger.child({ module: "sso-route" });

export async function GET(request: NextRequest) {
  if (!request.nextUrl.searchParams.get("assertedLoginIdentity")) {
    log.error("SSO route called without assertedLoginIdentity parameter");
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
  try {
    const state = "not-yet-implemented";
    const authConfig = await getAuthConfig();
    const clientConfig = await getClientConfig();
    const parameters: Record<string, string> = {
      redirect_uri: authConfig.redirect_uri,
      scope: authConfig.scope,
      state: state,
    };
    const redirectTo = client.buildAuthorizationUrl(clientConfig, parameters);
    // TODO: add in extra params needed eg prompt
    redirectTo.searchParams.append(
      "asserted_login_identity",
      <string>request.nextUrl.searchParams.get("assertedLoginIdentity"),
    );

    return NextResponse.redirect(redirectTo);
  } catch (e) {
    log.error("SSO route: error handling not-yet-implemented");
    throw new Error("not-yet-implemented");
  }
}
