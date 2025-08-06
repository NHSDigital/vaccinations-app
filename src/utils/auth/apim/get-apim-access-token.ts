import { fetchAPIMAccessTokenForIDToken } from "@src/utils/auth/apim/fetch-apim-access-token";
import { ApimAccessCredentials, ApimTokenResponse } from "@src/utils/auth/apim/types";
import { AccessToken, ExpiresAt, IdToken, RefreshTokenExpiresAt } from "@src/utils/auth/types";
import { configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { JWT, getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

const log = logger.child({ module: "get-apim-access-token" });

// check the apim auth cookie first;

// 1. if access token exists and is not expired, return it

// 2. or if access token exists but is expired, get the refresh token, call APIM to refresh and save the new access token on the cookie and return it

// 3. or if access token does not exist/is missing, get a new one: DONE
// save access token, refresh token and expiration time as a cookie DONE

const getApimAccessToken = async (): Promise<AccessToken> => {
  const token = await getJwtToken();

  if (!token?.apim?.access_token) {
    log.error({ token }, "Unable to get APIM access token");
    throw Error("No APIM access token available");
  }
  return token.apim.access_token;
};

const getJwtToken = async (): Promise<JWT | null> => {
  const config = await configProvider();
  const headerEntries = await headers();
  const cookieEntries = await cookies();
  const req = {
    headers: Object.fromEntries(headerEntries),
    cookies: Object.fromEntries(cookieEntries.getAll().map((c) => [c.name, c.value])),
  };

  return await getToken({ req, secret: config.AUTH_SECRET, secureCookie: true });
};

const getAccessTokenFromApim = async (idToken: IdToken, refresh: boolean = false): Promise<ApimAccessCredentials> => {
  const now = Date.now() / 1000;
  const response: ApimTokenResponse = await fetchAPIMAccessTokenForIDToken(idToken, refresh);
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresAt: Math.floor(now + parseInt(response.expires_in)) as ExpiresAt,
    refreshTokenExpiresAt: Math.floor(now + parseInt(response.refresh_token_expires_in)) as RefreshTokenExpiresAt,
  };
};

export { getApimAccessToken, getAccessTokenFromApim, getJwtToken };
