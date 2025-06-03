import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import NextAuth from "next-auth";
import "next-auth/jwt";
import { Logger } from "pino";
import { isValidSignIn } from "@src/utils/auth/callbacks/is-valid-signin";
import { getToken } from "@src/utils/auth/callbacks/get-token";

const log: Logger = logger.child({ module: "auth" });

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
        return isValidSignIn(account, config, log);
      },

      async jwt({ token, account, profile}) {
        return getToken(token, account, profile, config, MAX_SESSION_AGE_SECONDS, log);
      },

      async session({ session, token }) {
        if(token?.user && session.user) {
          session.user.nhs_number = token.user.nhs_number;
          session.user.birthdate = token.user.birthdate;
          session.user.access_token = token.access_token;
        }

        return session;
      }
    },
  };
});
