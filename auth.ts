import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import NextAuth, { type DefaultSession } from "next-auth";
import "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import { Logger } from "pino";
import pemToCryptoKey from "@src/utils/auth/pem-to-crypto-key";
import { JWT } from "@auth/core/jwt";
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
      nhs_number: string | null,
      birthdate: string | null,
      access_token?: string,
    } & DefaultSession["user"]
  }

  interface Profile {
    nhs_number: string,
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      nhs_number: string | null,
      birthdate: string | null,
    },
    expires_at: number,
    refresh_token?: string,
    access_token?: string,
  }
}

const log: Logger = logger.child({ module: "auth" });


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
      maxAge: 12 * 60 * 60,
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
        let updatedToken: JWT = {
          ...token,
          user: {
            nhs_number: token.user?.nhs_number ?? "",
            birthdate: token.user?.birthdate ?? null,
          },
          expires_at: token.expires_at ?? 0,
          access_token: token.access_token ?? "",
          refresh_token: token.refresh_token
        };

        // Initial login - account and profile are only defined for the initial login, afterward they become undefined
        if (account && profile) {
          updatedToken = {
            ...updatedToken,
            expires_at: account.expires_at ?? updatedToken.expires_at,
            access_token: account.access_token ?? updatedToken.access_token,
            refresh_token: account.refresh_token ?? updatedToken.refresh_token,
            user: {
              nhs_number: profile.nhs_number ?? updatedToken.user.nhs_number,
              birthdate: profile.birthdate ?? updatedToken.user.birthdate,
            },
          };
        }

        // Access Token missing or expired
        if (!updatedToken.expires_at || Date.now() >= updatedToken.expires_at * 1000) {
          logger.warn(`Token expired or expires_at missing. Attempting to refresh. Current refresh_token: ${updatedToken.refresh_token ? 'present' : 'missing'}`);

          if(!updatedToken.refresh_token) {
            logger.error("No refresh token available to new access token. User will be logged out.");
            return {
              ...updatedToken,
              expires_at: 0,
              access_token: "",
              refresh_token: undefined,
              user: {
                nhs_number: null,
                birthdate: null,
              },
            };
          }

          try {
            logger.warn("Attempting to retrieve new access token");
            const clientAssertion = await generateClientAssertion(await pemToCryptoKey(config.NHS_LOGIN_PRIVATE_KEY));

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
              expires_in: number;
              refresh_token?: string;
            };

            updatedToken = {
              ...updatedToken,
              access_token: newTokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
              refresh_token: newTokens.refresh_token ?? updatedToken.refresh_token,
              user: {
                nhs_number: updatedToken.user.nhs_number,
                birthdate: updatedToken.user.birthdate,
              },
            };

            logger.warn("Token successfully refreshed");
          } catch (error) {
            logger.error("Error during access_token refresh: ", error);

            return {
              ...updatedToken,
              expires_at: 0,
              access_token: "",
              refresh_token: undefined,
              user: {
                nhs_number: updatedToken.user.nhs_number ?? "",
                birthdate: updatedToken.user.birthdate ?? null,
              },
            };
          }
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
