"use client";

import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SESSION_TIMEOUT_ROUTE } from "@src/app/session-timeout/constants";
import { signOut } from "next-auth/react";
import { isMockedDevSession } from "@src/utils/feature-flags";

const userLogout = async (reasonTimeout: boolean = false) => {
  if (await isMockedDevSession()) {
    return;
  }

  signOut({
    redirect: true,
    redirectTo: reasonTimeout ? SESSION_TIMEOUT_ROUTE : SESSION_LOGOUT_ROUTE,
  });
};

export { userLogout };
