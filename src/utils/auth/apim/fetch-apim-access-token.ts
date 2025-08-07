import { ApimConfig, apimConfigProvider } from "@src/utils/apimConfig";
import { ApimTokenResponse } from "@src/utils/auth/apim/types";
import { APIMClientAssertionPayload, APIMTokenPayload, IdToken, RefreshToken } from "@src/utils/auth/types";
import { logger } from "@src/utils/logger";
import axios, { AxiosResponse, HttpStatusCode } from "axios";
import jwt from "jsonwebtoken";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "utils-auth-apim-fetch-apim-access-token" });

const generateClientAssertion = (apimConfig: ApimConfig): string => {
  const privateKey: string = apimConfig.APIM_PRIVATE_KEY;
  const payload: APIMClientAssertionPayload = {
    iss: apimConfig.ELIGIBILITY_API_KEY,
    sub: apimConfig.ELIGIBILITY_API_KEY,
    aud: apimConfig.APIM_AUTH_URL.href,
    jti: crypto.randomUUID(),
    exp: Math.floor(Date.now() / 1000) + 300,
  };
  log.debug({ payload }, "raw APIMClientAssertionPayload");

  return jwt.sign(payload, privateKey, { algorithm: "RS512", keyid: apimConfig.APIM_KEY_ID });
};

const generateAPIMTokenPayload = (
  apimConfig: ApimConfig,
  idToken: IdToken,
  refreshToken: RefreshToken | undefined,
): APIMTokenPayload => {
  const clientAssertion: string = generateClientAssertion(apimConfig);

  let tokenPayload: APIMTokenPayload;
  if (!refreshToken) {
    tokenPayload = {
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
      client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      subject_token: idToken,
      client_assertion: clientAssertion,
    };
  } else {
    tokenPayload = {
      grant_type: "urn:ietf:params:oauth:grant-type:refresh_token",
      client_id: apimConfig.ELIGIBILITY_API_KEY,
      client_secret: apimConfig.APIM_PRIVATE_KEY,
      refresh_token: refreshToken,
    };
  }
  return tokenPayload;
};

const fetchAPIMAccessTokenForIDToken = async (
  idToken: IdToken,
  refreshToken: RefreshToken | undefined,
): Promise<ApimTokenResponse> => {
  const apimConfig: ApimConfig = await apimConfigProvider();
  log.debug({ apimConfig }, "Fetching APIM Access Token");

  try {
    const tokenPayload = generateAPIMTokenPayload(apimConfig, idToken, refreshToken);
    log.debug({ tokenPayload }, "APIM token payload");

    const response: AxiosResponse<ApimTokenResponse> = await axios.post(apimConfig.APIM_AUTH_URL.href, tokenPayload, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 5000,
      validateStatus: (status) => status < HttpStatusCode.BadRequest,
    });

    log.info("APIM access token fetched");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log.error(
        { error, APIM_AUTH_URL: apimConfig.APIM_AUTH_URL.href, response_data: error.response?.data },
        `Error calling APIM token endpoint`,
      );
    } else {
      log.error({ error }, `Error generating APIM token request`);
    }
    throw new Error(`Error getting APIM token`);
  }
};

export { fetchAPIMAccessTokenForIDToken, generateAPIMTokenPayload };
