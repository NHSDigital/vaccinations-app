import { NextRequest, NextResponse } from "next/server";
import { logger } from "@src/utils/logger";
import { getClientConfig } from "@src/utils/auth/get-client-config";
import * as client from "openid-client";
import { getSession } from "@src/utils/auth/session";

const log = logger.child({ module: "callback-route" });

export async function GET(request: NextRequest) {
  const session = await getSession();
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

    const { access_token } = tokenSet;
    const claims = tokenSet.claims()!;
    const { sub } = claims;
    const userinfo = await client.fetchUserInfo(
      clientConfig!,
      access_token,
      sub,
    );

    session.isLoggedIn = true;
    session.access_token = access_token;
    session.state = state;
    session.userInfo = {
      sub: userinfo.sub,
    };

    await session.save();

    return NextResponse.redirect(request.nextUrl.origin);
  } catch (e) {
    log.error(e);
  }
}
