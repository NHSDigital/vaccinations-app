import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { createLoginAuditEvent } from "@src/utils/audit/audit-event";
import { sendAuditEvent } from "@src/utils/audit/audit-logger";
import { getToken } from "@src/utils/auth/callbacks/get-token";
import { getUpdatedSession } from "@src/utils/auth/callbacks/get-updated-session";
import { isValidSignIn } from "@src/utils/auth/callbacks/is-valid-signin";
import { MaxAgeInSeconds } from "@src/utils/auth/types";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { extractRequestContextFromHeaders } from "@src/utils/requestScopedStorageWrapper";
import NextAuth from "next-auth";
import "next-auth/jwt";
import { headers } from "next/headers";

const log = logger.child({ name: "auth" });

const AuthSignInPerformanceMarker = "auth-sign-in-callback";
const AuthJWTPerformanceMarker = "auth-jwt-callback";
const AuthSessionPerformanceMarker = "auth-session-callback";

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  const config: AppConfig = await configProvider();
  const MAX_SESSION_AGE_SECONDS: number = config.MAX_SESSION_AGE_MINUTES * 60;
  const headerValues = await headers();

  const requestContext: RequestContext = extractRequestContextFromHeaders(headerValues);

  return await asyncLocalStorage.run(requestContext, async () => {
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
      debug: process.env.DEPLOY_ENVIRONMENT === "local",
      trustHost: true,
      callbacks: {
        async signIn({ account, profile }) {
          let response: boolean;
          try {
            profilePerformanceStart(AuthSignInPerformanceMarker);
            response = isValidSignIn(account, config);
            profilePerformanceEnd(AuthSignInPerformanceMarker);
          } catch (error) {
            log.error({ error: error }, "signIn() callback error");
            response = false;
          }

          if (response) {
            const auditEvent: AuditEvent = createLoginAuditEvent(
              profile!.nhs_number,
              requestContext.traceId,
              "Success",
            );
            await sendAuditEvent(auditEvent);
          }

          return response;
        },

        async jwt({ token, account, profile }) {
          let response;
          try {
            profilePerformanceStart(AuthJWTPerformanceMarker);
            response = getToken(token, account, profile, config, MAX_SESSION_AGE_SECONDS as MaxAgeInSeconds);
            profilePerformanceEnd(AuthJWTPerformanceMarker);
          } catch (error) {
            log.error({ error: error }, "jwt() callback error");
            response = null;
          }
          return response;
        },

        async session({ session, token }) {
          let response;
          try {
            profilePerformanceStart(AuthSessionPerformanceMarker);
            response = getUpdatedSession(session, token);
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
