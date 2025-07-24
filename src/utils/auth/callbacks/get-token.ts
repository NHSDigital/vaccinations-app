import { APIMClientAssertionPayload, APIMTokenPayload, DecodedIdToken } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import axios from "axios";
import jwt from "jsonwebtoken";
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
    nhs_login: {
      id_token: token.nhs_login?.id_token ?? "",
    },
    apim: {
      access_token: token.apim?.access_token ?? "",
      expires_in: token.apim?.expires_in ?? 0,
      refresh_token: token.apim?.refresh_token ?? "",
      refresh_token_expires_in: token.apim?.refresh_token_expires_in ?? 0,
    },
  };
};

const isInitialLoginJourney = (account: Account | null | undefined, profile: Profile | null | undefined) => {
  return account && profile;
};

const missingUserAccessToken = (token: JWT): boolean => {
  return typeof token.apim?.access_token === "undefined";
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
      nhs_number: profile.nhs_number ?? "",
      birthdate: profile.birthdate ?? "",
    },
    nhs_login: {
      id_token: account.id_token ?? "",
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

  if (!isInitialLoginJourney(account, profile) && missingUserAccessToken(token)) {
    const accessToken: string | undefined = await getAccessTokenForIDToken(config, token.nhs_login.id_token);
    if (accessToken) {
      updatedToken = {
        ...updatedToken,
        apim: {
          access_token: accessToken,
          expires_in: 0,
          refresh_token: "",
          refresh_token_expires_in: 0,
        },
      };
    }
  }

  log.info({ updatedToken: updatedToken }, "Returning JWT from callback");
  return updatedToken;
};

const generateClientAssertion = (config: AppConfig): string => {
  const privateKey: string = process.env.APIM_PRIVATE_KEY ?? "undefined-apim-private-key";
  const payload: APIMClientAssertionPayload = {
    iss: config.CONTENT_API_KEY,
    sub: config.CONTENT_API_KEY,
    aud: process.env.APIM_AUTH_URL ?? "undefined-apim-auth-url",
    jti: crypto.randomUUID(),
    exp: Math.floor(Date.now() / 1000) + 300,
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS512", keyid: process.env.APIM_KEY_ID });
};

const getAccessTokenForIDToken = async (config: AppConfig, idToken: string): Promise<string | undefined> => {
  try {
    const clientAssertion: string = generateClientAssertion(config);
    log.info({ clientAssertion: clientAssertion, idToken: idToken }, "APIM");

    const decodedToken = jwtDecode<DecodedIdToken>(idToken);
    log.info({ idToken: decodedToken }, "decoded idToken");

    const tokenPayload: APIMTokenPayload = {
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
      client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      subject_token: idToken,
      client_assertion: clientAssertion,
    };

    const response = await axios.post(
      process.env.APIM_AUTH_URL ?? "undefined-apim-auth-url",
      new URLSearchParams(tokenPayload),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 5000,
      },
    );

    log.info({ response: response.data }, "APIM ok response");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log.error(
        {
          response: {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          },
        },
        "APIM error response",
      );
    }
    return undefined;
  }
};

export { getToken };
