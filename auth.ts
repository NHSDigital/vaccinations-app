import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { getToken } from "@src/utils/auth/callbacks/get-token";
import { getUpdatedSession } from "@src/utils/auth/callbacks/get-updated-session";
import { isValidSignIn } from "@src/utils/auth/callbacks/is-valid-signin";
import { MaxAgeInSeconds } from "@src/utils/auth/types";
import config from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { extractRequestContextFromHeadersAndCookies } from "@src/utils/requestScopedStorageWrapper";
import NextAuth from "next-auth";
import "next-auth/jwt";
import { cookies, headers } from "next/headers";

const log = logger.child({ module: "auth" });

const AuthSignInPerformanceMarker = "auth-sign-in-callback";
const AuthJWTPerformanceMarker = "auth-jwt-callback";
const AuthSessionPerformanceMarker = "auth-session-callback";

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  const MAX_SESSION_AGE_SECONDS: number = (await config.MAX_SESSION_AGE_MINUTES) * 60;
  const headerValues = await headers();
  const requestCookies = await cookies();

  const requestContext: RequestContext = extractRequestContextFromHeadersAndCookies(headerValues, requestCookies);

  return await asyncLocalStorage.run(requestContext, async () => {
    return {
      providers: [await NHSLoginAuthProvider()],
      secret: await config.AUTH_SECRET,
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
      debug: process.env.DEPLOY_ENVIRONMENT === "local",
      trustHost: true,
      callbacks: {
        async signIn({ account }) {
          log.debug("signIn() callback invoked");
          let response: boolean;
          try {
            profilePerformanceStart(AuthSignInPerformanceMarker);
            response = await isValidSignIn(account);
            profilePerformanceEnd(AuthSignInPerformanceMarker);
          } catch (error) {
            log.error({ error: error }, "signIn() callback error");
            response = false;
          }

          log.info({ context: { isValidSignIn: response } }, "NHS-Login callback");
          return response;
        },

        async jwt({ token, account, profile }) {
          log.debug("jwt() callback invoked");
          let response;
          try {
            profilePerformanceStart(AuthJWTPerformanceMarker);
            response = getToken(token, account, profile, MAX_SESSION_AGE_SECONDS as MaxAgeInSeconds);
            profilePerformanceEnd(AuthJWTPerformanceMarker);
          } catch (error) {
            log.error({ error: error }, "jwt() callback error");
            response = null;
          }
          return response;
        },

        async session({ session, token }) {
          log.debug("session() callback invoked");
          let response;
          try {
            profilePerformanceStart(AuthSessionPerformanceMarker);
            response = getUpdatedSession(session, token);
            log.debug("session() callback fetched session");
            profilePerformanceEnd(AuthSessionPerformanceMarker);
          } catch (error) {
            log.error({ error: error }, "session() callback error");
            response = { expires: new Date().toISOString() };
          }
          return response;
        },
      },
    };
  });
});
