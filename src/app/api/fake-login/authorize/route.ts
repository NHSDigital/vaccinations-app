import { logger } from "@src/utils/logger";
import { NextRequest, NextResponse } from "next/server";

const log = logger.child({ name: "fake-login" });

const code = "6b9183f8-5f6e-4616-9297-96b3b2bdc78d";

export const GET = async (request: NextRequest) => {
  log.info("Authorize endpoint called");

  const { searchParams } = new URL(request.url);
  const redirectUrl = new URL("/api/auth/callback/nhs-login", "https://localhost:3000");
  redirectUrl.searchParams.set("code", code);
  redirectUrl.searchParams.set("state", searchParams.get("state") ?? "state-not-found");
  return NextResponse.redirect(redirectUrl);
};
