import { auth } from "@project/auth";
import { ApimTokenResponse, fetchAPIMAccessTokenForIDToken } from "@src/utils/auth/apim/fetch-apim-access-token";
import { Session } from "next-auth";

const getNewAccessTokenFromApim = async () => {
  const session: Session | null = await auth();
  const idToken: string | undefined = session?.nhs_login.id_token;

  if (idToken) {
    const response: ApimTokenResponse = await fetchAPIMAccessTokenForIDToken(idToken);
    return response.access_token;
  } else {
    throw Error("No idToken available on session for APIM call");
  }
};

const getApimAccessToken = async (): Promise<string> => {
  return await getNewAccessTokenFromApim();
};

export { getApimAccessToken };
