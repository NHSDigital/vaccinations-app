"use server";

import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { cookies } from "next/headers";
import { SIGNOUT_FLAG_COOKIE_NAME } from "@src/utils/constants";

const setSignOutFlagCookie = async () => {
  return requestScopedStorageWrapper(setSignOutFlagCookieAction);
};

// VIA-942 2026-04-09 todo: do we need to check anything else here (security wise, send and check the csrf, etc?)
const setSignOutFlagCookieAction = async () => {
  const cookieStore = await cookies();
  cookieStore.set(SIGNOUT_FLAG_COOKIE_NAME, "true", { secure: true, httpOnly: true, sameSite: "lax", maxAge: 5 });
};

export default setSignOutFlagCookie;
