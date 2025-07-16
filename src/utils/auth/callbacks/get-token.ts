import { DecodedIdToken } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { jwtDecode } from "jwt-decode";
import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "utils-auth-callbacks-get-token" });

const fillMissingFieldsInTokenWithDefaultValues = (token: JWT): JWT => {
  return {
    ...token,
    user: {
      nhs_number: token.user?.nhs_number ?? "",
      birthdate: token.user?.birthdate ?? "",
    },
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
  let updatedToken: JWT = fillMissingFieldsInTokenWithDefaultValues(token);

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

  return updatedToken;
};

export { getToken };
