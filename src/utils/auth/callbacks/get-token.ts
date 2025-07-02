import { generateRefreshClientAssertionJwt } from "@src/utils/auth/generate-auth-payload";
import { JWT } from "next-auth/jwt";
import { Account, Profile } from "next-auth";
import { Logger } from "pino";
import { AppConfig } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { jwtDecode } from "jwt-decode";
import { DecodedIdToken } from "@src/utils/auth/types";

const log: Logger = logger.child({ module: "utils-auth-callbacks-get-token" });
const DEFAULT_ACCESS_TOKEN_EXPIRY: number = 5 * 60;

const getToken = async (
  token: JWT,
  account: Account | null | undefined,
  profile: Profile | undefined,
  config: AppConfig,
  maxAgeInSeconds: number,
) => {
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
    refresh_token: token.refresh_token ?? "",
    id_token: token.id_token ?? {
      jti: "",
    },
  };

  try {
    const nowInSeconds = Math.floor(Date.now() / 1000);

    // Maximum age reached scenario:
    // Invalidate session after fixedExpiry
    if (updatedToken.fixedExpiry && nowInSeconds >= updatedToken.fixedExpiry) {
      log.info("Session has reached the max age");
      return null;
    }

    // Initial login scenario:
    // account and profile are only defined for the initial login,
    // afterward they become undefined
    if (account && profile) {
      let jti = "";

      if (account.id_token) {
        const decodedToken = jwtDecode<DecodedIdToken>(account.id_token);
        jti = decodedToken.jti;
      }

      updatedToken = {
        ...updatedToken,
        expires_at: account.expires_at ?? 0,
        access_token: account.access_token ?? "",
        refresh_token: account.refresh_token ?? "",
        id_token: {
          jti: jti,
        },
        user: {
          nhs_number: profile.nhs_number ?? "",
          birthdate: profile.birthdate ?? "",
        },
        fixedExpiry: nowInSeconds + maxAgeInSeconds,
      };
      return updatedToken;
    }

    // Refresh token scenario:
    // Access Token missing or expired
    if (!updatedToken.expires_at || nowInSeconds >= updatedToken.expires_at) {
      log.info("Attempting to refresh token");

      if (!updatedToken.refresh_token) {
        log.error("Refresh token missing");
        return null;
      }

      const clientAssertion = await generateRefreshClientAssertionJwt(config);

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
};

export { getToken };
