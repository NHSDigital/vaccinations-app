import { logger } from "@src/utils/logger";
import { NextRequest, NextResponse } from "next/server";

const log = logger.child({ name: "fake-login" });

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  log.error(`${url} endpoint called`);

  return NextResponse.json(
    {
      error: "API route not found",
      path: url.pathname,
    },
    { status: 404 },
  );
}
