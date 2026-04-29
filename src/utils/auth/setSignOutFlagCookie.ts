"use server";

import { SESSION_ID_COOKIE_NAME, SIGNOUT_FLAG_COOKIE_NAME } from "@src/utils/constants";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { cookies } from "next/headers";

const setSignOutFlagCookie = async () => {
  return requestScopedStorageWrapper(setSignOutFlagCookieAction);
};

const setSignOutFlagCookieAction = async () => {
  const SIGN_OUT_FLAG_COOKIE_MAX_AGE_SECONDS = 30;
  const cookieStore = await cookies();
  const currentSessionId = cookieStore.get(SESSION_ID_COOKIE_NAME)?.value ?? "";
  cookieStore.set(SIGNOUT_FLAG_COOKIE_NAME, currentSessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: SIGN_OUT_FLAG_COOKIE_MAX_AGE_SECONDS,
  });
};

export default setSignOutFlagCookie;
