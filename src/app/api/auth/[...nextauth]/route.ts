import { handlers } from "@project/auth";
import { RequestContext, asyncLocalStorage } from "@project/src/utils/requestContext";
import { extractRequestContextFromHeadersAndCookies } from "@project/src/utils/requestScopedStorageWrapper";
import { NHS_LOGIN_PROVIDER_ID } from "@src/app/api/auth/[...nextauth]/provider";
import { logger } from "@src/utils/logger";
import { NextRequest } from "next/server";

const log = logger.child({ module: "auth-route" });

const NHS_LOGIN_CALLBACK_PATH = `/api/auth/callback/${NHS_LOGIN_PROVIDER_ID}`;

export const GET = async (req: NextRequest) => {
  const { pathname, searchParams } = req.nextUrl;

  const requestContext: RequestContext = extractRequestContextFromHeadersAndCookies(req.headers, req?.cookies);
  requestContext.nextUrl = pathname;

  return await asyncLocalStorage.run(requestContext, async () => {
    log.info({ context: { pathname }, ...requestContext }, "GET NextAuth route");

    const error = searchParams.get("error");
    if (pathname.includes(NHS_LOGIN_CALLBACK_PATH) && error) {
      log.error(
        {
          error,
          error_description: searchParams.get("error_description"),
        },
        "OAuth provider returned error in callback",
        requestContext,
      );
    }
    return await handlers.GET(req);
  });
};

export const { POST } = handlers;
