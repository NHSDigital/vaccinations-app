import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { VACCINATIONS_HUB_PAGE_ROUTE } from "@src/app/constants";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { getToken } from "@src/utils/auth/callbacks/get-token";
import { getUpdatedSession } from "@src/utils/auth/callbacks/get-updated-session";
import { isValidSignIn } from "@src/utils/auth/callbacks/is-valid-signin";
import { AppConfig, configProvider } from "@src/utils/config";
import NextAuth from "next-auth";
import "next-auth/jwt";

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  const config: AppConfig = await configProvider();
  const MAX_SESSION_AGE_SECONDS: number = config.MAX_SESSION_AGE_MINUTES * 60;

  return {
    providers: [await NHSLoginAuthProvider()],
    pages: {
      signIn: SSO_FAILURE_ROUTE,
      signOut: SESSION_LOGOUT_ROUTE,
      error: SSO_FAILURE_ROUTE,
      verifyRequest: SSO_FAILURE_ROUTE,
      newUser: SSO_FAILURE_ROUTE,
    },
    session: {
      strategy: "jwt",
      maxAge: MAX_SESSION_AGE_SECONDS,
    },
    trustHost: true,
    callbacks: {
      async signIn({ account }) {
        return isValidSignIn(account, config);
      },

      async jwt({ token, account, profile }) {
        return getToken(token, account, profile, config, MAX_SESSION_AGE_SECONDS);
      },

      async session({ session, token }) {
        return getUpdatedSession(session, token);
      },
    },
  };
});
