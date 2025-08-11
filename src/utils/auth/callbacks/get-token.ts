import { NhsNumber } from "@src/models/vaccine";
import { retrieveApimCredentials } from "@src/utils/auth/apim/get-apim-access-token";
import { ApimAccessCredentials } from "@src/utils/auth/apim/types";
import { BirthDate, ExpiresSoonAt, IdToken, MaxAgeInSeconds, NowInSeconds } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "utils-auth-callbacks-get-token" });

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
  maxAgeInSeconds: MaxAgeInSeconds,
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

  // TODO VIA-254 - can we do this only once? https://www.youtube.com/watch?v=A4I9DMSvJxg
  const apimAccessCredentials = await _getOrRefreshApimCredentials(config, token, nowInSeconds);

  // Inspect the token (which was either returned from login or fetched from session), fill missing or blank values with defaults
  let updatedToken: JWT = fillMissingFieldsInTokenWithDefaultValues(token, apimAccessCredentials);

  // Initial login scenario: account and profile are only defined for the initial login, afterward they become undefined
  if (isInitialLoginJourney(account, profile) && account != null && profile != null) {
    updatedToken = updateTokenWithValuesFromAccountAndProfile(
      updatedToken,
      account,
      profile,
      nowInSeconds as NowInSeconds,
      maxAgeInSeconds,
    );
  }

  log.debug({ updatedToken: updatedToken }, "Returning JWT from callback");
  return updatedToken;
};

async function _getOrRefreshApimCredentials(config: AppConfig, token: JWT, nowInSeconds: number) {
  let updatedApimCredentals: ApimAccessCredentials | undefined;

  const cryproAvailable = process.env.NEXT_RUNTIME === "nodejs";
  if (config.IS_APIM_AUTH_ENABLED && cryproAvailable) {
    if (!token.nhs_login?.id_token) {
      log.debug("getOrRefreshApimCredentials: No NHS login ID token available. Not getting APIM creds.");
    } else if (!token.apim?.access_token || token.apim.access_token === "") {
      log.debug({ existingApimCredentals: token.apim }, "getOrRefreshApimCredentials: Getting new APIM creds.");
      updatedApimCredentals = await retrieveApimCredentials(token.nhs_login.id_token);
      log.debug({ updatedApimCredentals }, "getOrRefreshApimCredentials: New APIM creds retrieved.");
    } else {
      const expiryWriggleRoom = 30; // TODO VIA-254 - set to 30 or so. This value is just for testing.
      const expiresSoonAt: ExpiresSoonAt = (token.apim?.expires_at - expiryWriggleRoom) as ExpiresSoonAt;

      if (expiresSoonAt < nowInSeconds) {
        log.debug({ existingApimCredentals: token.apim }, "getOrRefreshApimCredentials: Refreshing APIM creds.");
        // TODO VIA-254 - try just getting a new one?
        updatedApimCredentals = await retrieveApimCredentials(token.nhs_login.id_token);
        log.debug({ updatedApimCredentals }, "getOrRefreshApimCredentials: Refreshed APIM creds retrieved.");
      } else {
        log.debug(
          { existingApimCredentals: token.apim, nowInSeconds, timeRemaining: expiresSoonAt - nowInSeconds }, // TODO VIA-254 - don't log *all* this stuff?
          "getOrRefreshApimCredentials: APIM creds still fresh.",
        );
      }
    }
  }
  return updatedApimCredentals;
}

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
  nowInSeconds: NowInSeconds,
  maxAgeInSeconds: MaxAgeInSeconds,
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

export { getToken };
