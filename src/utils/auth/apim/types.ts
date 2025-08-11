import { AccessToken, ExpiresAt, ExpiresIn } from "@src/utils/auth/types";

export type ApimAccessCredentials = {
  accessToken: AccessToken;
  expiresAt: ExpiresAt;
};

export type ApimTokenResponse = {
  access_token: AccessToken;
  expires_in: ExpiresIn;
  issued_token_type: "urn:ietf:params:oauth:token-type:access_token";
  token_type: "Bearer";
};
