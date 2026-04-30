"use server";

import { signOut } from "@project/auth";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SESSION_TIMEOUT_ROUTE } from "@src/app/session-timeout/constants";
import setSignOutFlagCookie from "@src/utils/auth/setSignOutFlagCookie";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";

const userLogout = async (reasonTimeout: boolean = false) => {
  return requestScopedStorageWrapper(userLogoutAction, reasonTimeout);
};

const userLogoutAction = async (reasonTimeout: boolean = false) => {
  await setSignOutFlagCookie();
  await signOut({
    redirect: true,
    redirectTo: reasonTimeout ? SESSION_TIMEOUT_ROUTE : SESSION_LOGOUT_ROUTE,
  });
};

export { userLogout };
