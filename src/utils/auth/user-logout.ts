"use client";

import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { signOut } from "next-auth/react";

const userLogout = () => {
  signOut({
    redirect: true,
    redirectTo: SESSION_LOGOUT_ROUTE,
  });
};

export { userLogout };
