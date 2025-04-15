import { NextRequest, NextResponse } from "next/server";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "sso-route" });

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("assertedLoginIdentity")) {
    return NextResponse.json({ placeholder: "to-be-implemented" });
  } else {
    log.error("SSO route called without assertedLoginIdentity parameter");

    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
}
