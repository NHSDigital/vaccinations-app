import { WarningCode } from "@auth/core/types";
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
import NextAuth from "next-auth";
import "next-auth/jwt";
import { cookies } from "next/headers";

const log = logger.child({ module: "auth" });

const AuthSignInPerformanceMarker = "auth-sign-in-callback";
const AuthJWTPerformanceMarker = "auth-jwt-callback";
const AuthSessionPerformanceMarker = "auth-session-callback";

/**
 * When calling any Auth function (e.g. auth(), signIn(), signOut())
 * NextAuth will invoke the relevant callback (e.g. jwt(), session(), signIn() etc)
 * defined in this file.
 *
 * In order for logging and performance profiling to work correctly within those callbacks,
 * we need to ensure that the asyncLocalStorage request context is properly propagated to them.
 */
export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  const MAX_SESSION_AGE_SECONDS: number = (await config.MAX_SESSION_AGE_MINUTES) * 60;
  const requestCookies = await cookies();

  function getHasCookies() {
    return {
      hasState: requestCookies.has("__Secure-authjs.state"),
      hasNonce: requestCookies.has("__Secure-authjs.nonce"),
      hasSessionToken: requestCookies.has("__Secure-authjs.session-token"),
      hasCSRFToken: requestCookies.has("__Host-authjs.csrf-token"),
      hasSessionId: requestCookies.has("__Host-Http-session-id"),
    };
  }

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
    logger: {
      error(error: Error) {
        const hasCookies = getHasCookies();
        log.error(
          {
            error: {
              cause: error.cause,
              message: error.message,
            },
            context: {
              cookies: hasCookies,
            },
          },
          "Error from NextAuth",
        );
      },
      warn(code: WarningCode) {
        const hasCookies = getHasCookies();
        log.warn(
          {
            context: {
              code,
              cookies: hasCookies,
            },
          },
          "Warning from NextAuth",
        );
      },
      debug(message: string, metadata?) {
        const hasCookies = getHasCookies();
        log.debug(
          {
            context: {
              message,
              metadata,
              cookies: hasCookies,
            },
          },
          "Debug from NextAuth",
        );
      },
    },
  };
});
