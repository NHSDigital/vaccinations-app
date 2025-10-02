import { ApimMissingTokenError } from "@src/utils/auth/apim/exceptions";
import { fetchAPIMAccessToken } from "@src/utils/auth/apim/fetch-apim-access-token";
import { getOrRefreshApimCredentials } from "@src/utils/auth/apim/get-or-refresh-apim-credentials";
import { ApimAccessCredentials, ApimTokenResponse } from "@src/utils/auth/apim/types";
import { getJwtToken } from "@src/utils/auth/get-jwt-token";
import { AccessToken, ExpiresAt, IdToken } from "@src/utils/auth/types";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "utils-auth-apim-get-apim-access-token" });

const getApimAccessToken = async (): Promise<AccessToken> => {
  /**
   * Gets the APIM access token from the JWT session cookie.
   *
   * @remarks
   * The JTW should already have been retrieved. @see {@link @src/utils/auth/callbacks/get-token.ts}
   *
   * @returns A Promise, resolving to the APIM access token.
   */
  const token = await getJwtToken();

  if (!token?.apim?.access_token) {
    log.error({ context: { token } }, "APIM access token is not present on JWT token");
    throw new ApimMissingTokenError("APIM access token is not present on JWT token");
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const apimAccessCredentials = await getOrRefreshApimCredentials(token, nowInSeconds);

  if (!apimAccessCredentials) {
    log.error("Error: getOrRefreshApimCredentials returned undefined");
    throw new Error("getOrRefreshApimCredentials returned undefined");
  } else {
    log.info(`Preparing to fetch-eligibility-content: APIM expires at ${apimAccessCredentials.expiresAt}`);
    return apimAccessCredentials.accessToken;
  }
};

const retrieveApimCredentials = async (idToken: IdToken): Promise<ApimAccessCredentials> => {
  /**
   * Get APIM credentals from APIM. If no refreshToken is passed, it will get new credentials.
   * If refreshToken *is* passed, will refresh them.
   *
   * @returns A Promise, resolving to the APIM credentials.
   */
  const now = Date.now() / 1000;
  const response: ApimTokenResponse = await fetchAPIMAccessToken(idToken);
  return {
    accessToken: response.access_token,
    expiresAt: Math.floor(now + parseInt(response.expires_in)) as ExpiresAt,
  };
};

export { getApimAccessToken, retrieveApimCredentials };
