"use server";

import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { cookies } from "next/headers";
import { SIGNOUT_FLAG_COOKIE_NAME } from "@src/utils/constants";

const setSignOutFlagCookie = async () => {
  return requestScopedStorageWrapper(setSignOutFlagCookieAction);
};

const setSignOutFlagCookieAction = async () => {
  const cookieStore = await cookies();
  //TODO: Set the value of the cookie to either session-id or the expiry time of the current session.
  //TODO: If using session-id/expiry time we can update the maxAge to 30 seconds
  cookieStore.set(SIGNOUT_FLAG_COOKIE_NAME, "true", {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 5,
  });
};

export default setSignOutFlagCookie;
