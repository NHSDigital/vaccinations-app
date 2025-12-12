import { NhsNumber } from "@src/models/vaccine";
import { getOrRefreshApimCredentials } from "@src/utils/auth/apim/get-or-refresh-apim-credentials";
import { ApimAccessCredentials } from "@src/utils/auth/apim/types";
import { BirthDate, IdToken, MaxAgeInSeconds, NowInSeconds } from "@src/utils/auth/types";
import { logger } from "@src/utils/logger";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { extractRequestContextFromHeaders } from "@src/utils/requestScopedStorageWrapper";
import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { headers } from "next/headers";
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
  maxAgeInSeconds: MaxAgeInSeconds,
) => {
  const headerValues = await headers();

  const requestContext: RequestContext = extractRequestContextFromHeaders(headerValues);

  return await asyncLocalStorage.run(requestContext, async () => {
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

    let updatedToken: JWT = token;

    // Initial login scenario: account and profile are only defined for the initial login, afterward they become undefined
    if (isInitialLoginJourney(account, profile) && account != null && profile != null) {
      updatedToken = updateTokenWithValuesFromAccountAndProfile(
        token,
        account,
        profile,
        nowInSeconds as NowInSeconds,
        maxAgeInSeconds,
      );
    }

    let apimAccessCredentials = undefined;

    try {
      // TODO VIA-254 - can we do this only once per request?
      // every time auth() is called, the getToken() callback is invoked by NextAuth
      // this results in fetching APIM access token multiple times ( in case it has expired )
      apimAccessCredentials = await getOrRefreshApimCredentials(token, nowInSeconds);
    } catch (error) {
      let errorMessage = undefined;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      log.error(
        { context: { errorMessage: errorMessage } },
        "Error fetching APIM credentials; continuing to create session with empty APIM fields",
      );
    }

    // Inspect the token (which was either returned from login or fetched from session), fill missing or blank values with defaults
    updatedToken = fillMissingFieldsInTokenWithDefaultValues(updatedToken, apimAccessCredentials);

    log.debug({ context: { updatedToken } }, "Returning JWT from callback");
    return updatedToken;
  });
};

const fillMissingFieldsInTokenWithDefaultValues = (token: JWT, apimAccessCredentials?: ApimAccessCredentials): JWT => {
  return {
    ...token,
    user: {
      nhs_number: token.user?.nhs_number ?? ("" as NhsNumber),
      birthdate: token.user?.birthdate ?? ("" as BirthDate),
    },
    nhs_login: {
      id_token: token.nhs_login?.id_token ?? ("" as IdToken),
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
): JWT => {
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
