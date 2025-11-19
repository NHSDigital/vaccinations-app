import { OIDCConfig } from "@auth/core/providers";
import pemToCryptoKey from "@src/utils/auth/pem-to-crypto-key";
import lazyConfig from "@src/utils/lazy-config";
import { Profile } from "next-auth";

export const NHS_LOGIN_PROVIDER_ID = "nhs-login";

const NHSLoginAuthProvider = async (): Promise<OIDCConfig<Profile>> => {
  return {
    id: NHS_LOGIN_PROVIDER_ID,
    name: "NHS Login Auth Provider",
    type: "oidc",
    issuer: (await lazyConfig.NHS_LOGIN_URL) as string,
    clientId: (await lazyConfig.NHS_LOGIN_CLIENT_ID) as string,
    wellKnown: `${await lazyConfig.NHS_LOGIN_URL}/.well-known/openid-configuration`,
    authorization: {
      params: {
        scope: `${await lazyConfig.NHS_LOGIN_SCOPE}`,
        prompt: "none",
      },
    },
    token: {
      clientPrivateKey: await pemToCryptoKey((await lazyConfig.NHS_LOGIN_PRIVATE_KEY) as string),
    },
    client: {
      token_endpoint_auth_method: "private_key_jwt",
      userinfo_signed_response_alg: "RS512",
    },
    idToken: true,
    checks: ["state"],
  };
};

export default NHSLoginAuthProvider;
