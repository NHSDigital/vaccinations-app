import { OIDCConfig } from "@auth/core/providers";
import pemToCryptoKey from "@src/utils/auth/pem-to-crypto-key";
import { AppConfig, configProvider } from "@src/utils/config";
import { Profile } from "next-auth";

export const NHS_LOGIN_PROVIDER_ID = "nhs-login";

const config: AppConfig = await configProvider();

const NHSLoginAuthProvider = async (): Promise<OIDCConfig<Profile>> => {
  return {
    id: NHS_LOGIN_PROVIDER_ID,
    name: "NHS Login Auth Provider",
    type: "oidc",
    issuer: config.NHS_LOGIN_URL,
    clientId: config.NHS_LOGIN_CLIENT_ID,
    wellKnown: `${config.NHS_LOGIN_URL}/.well-known/openid-configuration`,
    authorization: {
      params: {
        scope: `${config.NHS_LOGIN_SCOPE}`,
        prompt: "none",
      }
    },
    token: {
      clientPrivateKey: await pemToCryptoKey(config.VACCINATION_APP_PRIVATE_KEY)
    },
    client: {
      token_endpoint_auth_method: "private_key_jwt",
      userinfo_signed_response_alg: "RS512"
    },
    idToken: true,
    checks: ["state"],
  };
};

export default NHSLoginAuthProvider;
