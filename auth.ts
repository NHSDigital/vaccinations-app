import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import NextAuth, { type DefaultSession } from "next-auth";
import "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import { Logger } from "pino";
import { generateClientAssertion } from "@src/utils/auth/generate-refresh-client-assertion";

export interface DecodedToken {
  iss: string;
  aud: string;
  identity_proofing_level: string;
}

// Augmenting types. Ref https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      nhs_number: string,
      birthdate: string,
      access_token: string,
    } & DefaultSession["user"],
  }

  interface Profile {
    nhs_number: string,
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      nhs_number: string,
      birthdate: string,
    },
    expires_at: number,
    refresh_token: string,
    access_token: string,
    fixedExpiry: number;
  }
}

const log: Logger = logger.child({ module: "auth" });

const MAX_SESSION_AGE_SECONDS: number = 12 * 60 * 60; // 12 hours of continuous usage
const DEFAULT_ACCESS_TOKEN_EXPIRY: number = 5 * 60; // 5 minutes

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
        if (!account || typeof account.id_token !== "string") {
          log.info("Access denied from signIn callback. Account or id_token missing.");
          return false;
        }

        const decodedToken = jwtDecode<DecodedToken>(account.id_token);
        const { iss, aud, identity_proofing_level } = decodedToken;

        const isValidToken =
          iss === config.NHS_LOGIN_URL &&
          aud === config.NHS_LOGIN_CLIENT_ID &&
          identity_proofing_level === "P9";

        if (!isValidToken) {
          log.info(`Access denied from signIn callback. iss: ${iss}, aud: ${aud}, identity_proofing_level: ${identity_proofing_level}`);
        }
        return isValidToken;
      },
      async jwt({ token, account, profile}) {
        if (!token) {
          log.error("No token available in jwt callback.");
          return null;
        }

        let updatedToken = {
          ...token,
          user: {
            nhs_number: token.user?.nhs_number ?? "",
            birthdate: token.user?.birthdate ?? "",
          },
          expires_at: token.expires_at ?? 0,
          access_token: token.access_token ?? "",
          refresh_token: token.refresh_token ?? ""
        };

        try {
          const nowInSeconds = Math.floor(Date.now() / 1000);

          // Maximum age reached scenario:
          // Invalidate session after fixedExpiry
          if (updatedToken.fixedExpiry && nowInSeconds >= updatedToken.fixedExpiry) {
            logger.info("Session has reached the max age");
            return null;
          }

          // Initial login scenario:
          // account and profile are only defined for the initial login,
          // afterward they become undefined
          if (account && profile) {
            updatedToken = {
              ...updatedToken,
              expires_at: account.expires_at ?? 0,
              access_token: account.access_token ?? "",
              refresh_token: account.refresh_token ?? "",
              user: {
                nhs_number: profile.nhs_number ?? "",
                birthdate: profile.birthdate ?? "",
              },
              fixedExpiry: nowInSeconds + MAX_SESSION_AGE_SECONDS
            };
            return updatedToken;
          }

          // Refresh token scenario:
          // Access Token missing or expired
          if (!updatedToken.expires_at || nowInSeconds >= updatedToken.expires_at) {
            logger.info("Attempting to refresh token");

            if (!updatedToken.refresh_token) {
              logger.error("Refresh token missing");
              return null;
            }

            const clientAssertion = await generateClientAssertion(config);

            const requestBody = {
              grant_type: "refresh_token",
              refresh_token: updatedToken.refresh_token,
              client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
              client_assertion: clientAssertion,
            };

            const response = await fetch(`${config.NHS_LOGIN_URL}/token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams(requestBody),
            });

            const tokensOrError = await response.json();
            if (!response.ok) throw tokensOrError;

            const newTokens = tokensOrError as {
              access_token: string;
              expires_in?: number;
              refresh_token?: string;
            };

            updatedToken = {
              ...updatedToken,
              access_token: newTokens.access_token,
              expires_at: nowInSeconds + (newTokens.expires_in ?? DEFAULT_ACCESS_TOKEN_EXPIRY),
              refresh_token: newTokens.refresh_token ?? updatedToken.refresh_token,
            };

            return updatedToken;
          }
        } catch (error) {
          log.error(error, "Error in jwt callback");
          return null;
        }

        return updatedToken;
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
