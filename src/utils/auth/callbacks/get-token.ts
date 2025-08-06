import { NhsNumber } from "@src/models/vaccine";
import { getAccessTokenFromApim } from "@src/utils/auth/apim/get-apim-access-token";
import { ApimAccessCredentials } from "@src/utils/auth/apim/types";
import { BirthDate, IdToken } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "utils-auth-callbacks-get-token" });

const fillMissingFieldsInTokenWithDefaultValues = (token: JWT, apimAccessCredentials?: ApimAccessCredentials): JWT => {
  return {
    ...token,
    user: {
      nhs_number: token.user?.nhs_number ?? "",
      birthdate: token.user?.birthdate ?? "",
    },
    nhs_login: {
      id_token: token.nhs_login?.id_token ?? "",
    },
    apim: {
      access_token: (apimAccessCredentials ? apimAccessCredentials.accessToken : token.apim?.access_token) ?? "",
      expires_at: (apimAccessCredentials ? apimAccessCredentials.expiresAt : token.apim?.expires_at) ?? 0,
      refresh_token: (apimAccessCredentials ? apimAccessCredentials.refreshToken : token.apim?.refresh_token) ?? "",
      refresh_token_expires_at:
        (apimAccessCredentials ? apimAccessCredentials.refreshTokenExpiresAt : token.apim?.refresh_token_expires_at) ??
        0,
    },
  };
};

const isInitialLoginJourney = (account: Account | null | undefined, profile: Profile | null | undefined) => {
  return account && profile;
};

const updateTokenWithValuesFromAccountAndProfile = (
  token: JWT,
  account: Account,
  profile: Profile,
  nowInSeconds: number,
  maxAgeInSeconds: number,
) => {
  const updatedToken: JWT = {
    ...token,
    user: {
      nhs_number: (profile.nhs_number ?? "") as NhsNumber,
      birthdate: (profile.birthdate ?? "") as BirthDate,
    },
    nhs_login: {
      id_token: (account.id_token ?? "") as IdToken,
    },
    fixedExpiry: nowInSeconds + maxAgeInSeconds,
  };

  return updatedToken;
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

  let apimAccessCredentials: ApimAccessCredentials | undefined;
  if (config.IS_APIM_AUTH_ENABLED && process.env.NEXT_RUNTIME === "nodejs") {
    if (!token.nhs_login?.id_token) {
      // TODO VIA-254 - Is this an error?
      log.warn("getToken: No NHS login ID token available. Not getting APIM creds.");
    } else if (!token.apim?.access_token || token.apim.access_token === "") {
      apimAccessCredentials = await getAccessTokenFromApim(token.nhs_login.id_token);
    } else {
      const expiresSoonAt = token.apim?.expires_at - 30;
      const refreshTokenExpiresSoonAt = token.apim?.refresh_token_expires_at - 30;
      if (expiresSoonAt < nowInSeconds || refreshTokenExpiresSoonAt < nowInSeconds) {
        // TODO VIA-254 - We probably need something slightly different here? https://digital.nhs.uk/developer/guides-and-documentation/security-and-authorisation/user-restricted-restful-apis-nhs-login-separate-authentication-and-authorisation#step-10-refresh-your-access-token
        apimAccessCredentials = await getAccessTokenFromApim(token.nhs_login.id_token, true);
      }
    }
  }

  // Inspect the token (which was either returned from login or fetched from session), fill missing or blank values with defaults
  let updatedToken: JWT = fillMissingFieldsInTokenWithDefaultValues(token, apimAccessCredentials);

  // Initial login scenario: account and profile are only defined for the initial login, afterward they become undefined
  if (isInitialLoginJourney(account, profile) && account != null && profile != null) {
    updatedToken = updateTokenWithValuesFromAccountAndProfile(
      updatedToken,
      account,
      profile,
      nowInSeconds,
      maxAgeInSeconds,
    );
  }

  log.debug({ updatedToken: updatedToken }, "Returning JWT from callback");
  return updatedToken;
};

export { getToken };
