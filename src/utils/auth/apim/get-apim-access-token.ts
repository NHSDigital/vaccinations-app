import { fetchAPIMAccessToken } from "@src/utils/auth/apim/fetch-apim-access-token";
import { ApimAccessCredentials, ApimTokenResponse } from "@src/utils/auth/apim/types";
import { AccessToken, ExpiresAt, IdToken, RefreshToken, RefreshTokenExpiresAt } from "@src/utils/auth/types";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { JWT, getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

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
  const token = await _getJwtToken();

  if (!token?.apim?.access_token) {
    log.error("Unable to get APIM access token");
    throw Error("No APIM access token available");
  }
  return token.apim.access_token;
};

const _getJwtToken = async (): Promise<JWT | null> => {
  const config: AppConfig = await configProvider();
  const headerEntries = await headers();
  const cookieEntries = await cookies();
  const req = {
    headers: Object.fromEntries(headerEntries),
    cookies: Object.fromEntries(cookieEntries.getAll().map((c) => [c.name, c.value])),
  };

  return await getToken({ req, secret: config.AUTH_SECRET, secureCookie: true });
};

const retrieveApimCredentials = async (
  idToken: IdToken,
  refreshToken: RefreshToken | undefined = undefined,
): Promise<ApimAccessCredentials> => {
  /**
   * Get APIM credentals from APIM. If no refreshToken is passed, it will get new credentials.
   * If refreshToken *is* passed, will refresh them.
   *
   * @returns A Promise, resolving to the APIM credentials.
   */
  const now = Date.now() / 1000;
  const response: ApimTokenResponse = await fetchAPIMAccessToken(idToken, refreshToken);
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresAt: Math.floor(now + parseInt(response.expires_in)) as ExpiresAt,
    refreshTokenExpiresAt: Math.floor(now + parseInt(response.refresh_token_expires_in)) as RefreshTokenExpiresAt,
  };
};

export { getApimAccessToken, retrieveApimCredentials };
