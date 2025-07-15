import { generateRefreshClientAssertionJwt } from "@src/utils/auth/generate-auth-payload";
import { DecodedIdToken } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { jwtDecode } from "jwt-decode";
import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "utils-auth-callbacks-get-token" });
const DEFAULT_ACCESS_TOKEN_EXPIRY: number = 5 * 60;

const fillMissingFieldsInTokenWithDefaultValues = (token: JWT) => {
  return {
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
};

const isInitialLoginJourney = (account: Account | null | undefined, profile: Profile | undefined) => {
  return account && profile;
};

const updateTokenWithValuesFromAccountAndProfile = (
  token: JWT,
  account: Account,
  profile: Profile,
  nowInSeconds: number,
  maxAgeInSeconds: number,
) => {
  let jti = "";

  if (account.id_token) {
    const decodedToken = jwtDecode<DecodedIdToken>(account.id_token);
    jti = decodedToken.jti;
  }

  const updatedToken: JWT = {
    ...token,
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
};

const accessTokenHasExpired = (updatedToken: JWT, nowInSeconds: number) => {
  return !updatedToken.expires_at || nowInSeconds >= updatedToken.expires_at;
};

const callRefreshTokenEndpointAndUpdateToken = async (config: AppConfig, updatedToken: JWT, nowInSeconds: number) => {
  const clientAssertion = await generateRefreshClientAssertionJwt(config);

  const requestBody = {
    grant_type: "refresh_token",
    refresh_token: updatedToken.refresh_token,
    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: clientAssertion,
  };

  const encodedBody = new URLSearchParams(requestBody);

  log.info(`callRefreshTokenEndpointAndUpdateToken: calling ${config.NHS_LOGIN_URL}/token`);
  const response = await fetch(`${config.NHS_LOGIN_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedBody,
  });

  const tokensOrErrorResponseBody = await response.json();
  if (!response.ok) {
    log.error(
      tokensOrErrorResponseBody,
      `callRefreshTokenEndpointAndUpdateToken: Error response status ${response.status}`,
    );
    throw tokensOrErrorResponseBody;
  }

  const newTokens = tokensOrErrorResponseBody as {
    access_token: string;
    expires_in?: number;
    refresh_token?: string;
  };

  log.info(`callRefreshTokenEndpointAndUpdateToken: Token refreshed successfully. Updating token.`);

  const updatedTokenDebug = {
    ...updatedToken,
    access_token: newTokens.access_token,
    expires_at: nowInSeconds + (newTokens.expires_in ?? DEFAULT_ACCESS_TOKEN_EXPIRY),
    refresh_token: newTokens.refresh_token ?? updatedToken.refresh_token,
  };

  return updatedTokenDebug;
};

/* from Next Auth documentation:
 *  This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated
 *  (i.e whenever a session is accessed in the client). Anything you return here will be saved
 *  in the JWT and forwarded to the session callback. There you can control what should be
 *  returned to the client. Anything else will be kept from your frontend. The JWT is encrypted
 *  by default via your AUTH_SECRET environment variable.
 */
const getToken = async (
  token: JWT,
  account: Account | null | undefined,
  profile: Profile | undefined,
  config: AppConfig,
  maxAgeInSeconds: number,
) => {
  if (!token) {
    log.error("getToken: No token available in jwt callback. Returning null");
    return null;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);

  // Maximum age reached scenario: invalidate session after fixedExpiry
  if (token.fixedExpiry && nowInSeconds >= token.fixedExpiry) {
    log.info("getToken: Token has reached fixedExpiry time, or session has reached the max age. Returning null");
    return null;
  }

  // Inspect the token (which was either returned from login or fetched from session), fill missing or blank values with defaults
  let updatedToken = fillMissingFieldsInTokenWithDefaultValues(token);

  try {
    // Initial login scenario: account and profile are only defined for the initial login, afterward they become undefined
    if (isInitialLoginJourney(account, profile) && account != null && profile != null) {
      updatedToken = updateTokenWithValuesFromAccountAndProfile(
        updatedToken,
        account,
        profile,
        nowInSeconds,
        maxAgeInSeconds,
      );
      return updatedToken;
    } else {
      // Refresh token scenario: Access Token missing expiry time or has expired
      if (accessTokenHasExpired(updatedToken, nowInSeconds)) {
        log.info(
          updatedToken,
          `getToken: updatedToken has reached expiresAt time. Attempting to refresh token - ${nowInSeconds}`,
        );

        if (!updatedToken.refresh_token) {
          log.error("getToken: unable to refresh token: refresh_token value is missing. Returning null");
          return null;
        }

        updatedToken = await callRefreshTokenEndpointAndUpdateToken(config, updatedToken, nowInSeconds);

        return updatedToken;
      }
    }
  } catch (error) {
    log.error(error, "getToken: Error in jwt callback");
    return null;
  }

  return updatedToken;
};

export { getToken };
