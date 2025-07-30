import { auth } from "@project/auth";
import { fetchAPIMAccessTokenForIDToken } from "@src/utils/auth/apim/fetch-apim-access-token";
import { AccessToken, ApimAccessCredentials, ApimTokenResponse } from "@src/utils/auth/apim/types";
import { Session } from "next-auth";
import { cookies } from "next/headers";

// check the apim auth cookie first;

// 1. if accesstoken exists and is not expired, return it

// 2. or if access token exists but is expired, get the refresh token, call APIM to refresh and save the new access token on the cookie and return it

// 3. or if access token does not exist/is missing, get a new one:
// save access token, refresh token and expiration time as a cookie

const getNewAccessTokenFromApim = async (): Promise<ApimAccessCredentials> => {
  const session: Session | null = await auth();
  const idToken: string | undefined = session?.nhs_login.id_token;

  if (idToken) {
    const response: ApimTokenResponse = await fetchAPIMAccessTokenForIDToken(idToken);
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresIn: response.expires_in,
    };
  } else {
    throw Error("No idToken available on session for APIM call");
  }
};

const getApimAccessToken = async (): Promise<AccessToken> => {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has("apim");

  if (!hasCookie) {
    return (await getNewAccessTokenFromApim()).accessToken;
  }
  return "" as AccessToken;
};

export { getApimAccessToken };
