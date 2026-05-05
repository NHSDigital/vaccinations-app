"use server";

import { SESSION_ID_COOKIE_NAME, SIGNOUT_FLAG_COOKIE_NAME } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { cookies } from "next/headers";

const log = logger.child({ module: "utils-auth-setSignOutFlagCookie" });

const setSignOutFlagCookie = async () => {
  return requestScopedStorageWrapper(setSignOutFlagCookieAction);
};

const setSignOutFlagCookieAction = async () => {
  const SIGN_OUT_FLAG_COOKIE_MAX_AGE_SECONDS = 30;
  const cookieStore = await cookies();
  const currentSessionId = cookieStore.get(SESSION_ID_COOKIE_NAME)?.value ?? "";
  if (!currentSessionId) {
    log.warn("Session ID missing, skipping signout cookie");
    return;
  }
  cookieStore.set(SIGNOUT_FLAG_COOKIE_NAME, currentSessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SIGN_OUT_FLAG_COOKIE_MAX_AGE_SECONDS,
  });
};

export default setSignOutFlagCookie;
