import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { AppConfig, configProvider } from "@src/utils/config";
import NextAuth from "next-auth";
import "next-auth/jwt";
import { isValidSignIn } from "@src/utils/auth/callbacks/is-valid-signin";
import { getToken } from "@src/utils/auth/callbacks/get-token";
import { getUpdatedSession } from "@src/utils/auth/callbacks/get-updated-session";

const MAX_SESSION_AGE_SECONDS: number = 12 * 60 * 60; // 12 hours of continuous usage

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  const config: AppConfig = await configProvider();

  return {
    providers: [await NHSLoginAuthProvider()],
    pages: {
      signIn: SSO_FAILURE_ROUTE,
      signOut: SESSION_LOGOUT_ROUTE,
      error: SSO_FAILURE_ROUTE,
      verifyRequest: SSO_FAILURE_ROUTE,
      newUser: SSO_FAILURE_ROUTE
    },
    session: {
      strategy: "jwt",
      maxAge: MAX_SESSION_AGE_SECONDS, // 12 hours of continuous usage
    },
    trustHost: true,
    callbacks: {
      async signIn({ account }) {
        return isValidSignIn(account, config);
      },

      async jwt({ token, account, profile}) {
        return getToken(token, account, profile, config, MAX_SESSION_AGE_SECONDS);
      },

      async session({ session, token }) {
        return getUpdatedSession(session, token);
      }
    },
  };
});
