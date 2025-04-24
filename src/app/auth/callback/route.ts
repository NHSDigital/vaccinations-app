import { NextRequest, NextResponse } from "next/server";
import { logger } from "@src/utils/logger";
import { getClientConfig } from "@src/utils/auth/get-client-config";
import * as client from "openid-client";

const log = logger.child({ module: "callback-route" });

export async function GET(request: NextRequest) {
  // TODO: Check if the state we receive back with the callback is the same as the one in session?
  // TEMP CODE: Using the state from request, just until we have sessions in place
  const state = request.nextUrl.searchParams.get("state");

  if (!state) {
    log.error("State value not found in request");
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  try {
    const clientConfig = await getClientConfig();

    const tokenSet = await client.authorizationCodeGrant(
      clientConfig,
      new URL(request.url),
      {
        expectedState: state,
      },
    );

    console.log("Token Set:", tokenSet);
    const { access_token } = tokenSet;
    const claims = tokenSet.claims()!;
    const { sub } = claims;

    // call userinfo endpoint to get user info
    const userinfo = await client.fetchUserInfo(
      clientConfig!,
      access_token,
      sub,
    );

    console.log("User Info:", userinfo);
  } catch (e) {
    log.error(e);
  }

  return NextResponse.json({
    content: "Hello World",
  });
}
