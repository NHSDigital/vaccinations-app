import { AccessToken, ExpiresIn, RefreshCount, RefreshToken, RefreshTokenExpiresIn } from "@src/utils/auth/types";

export type ApimAccessCredentials = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  expiresIn: ExpiresIn;
};

export type ApimTokenResponse = {
  access_token: AccessToken;
  expires_in: ExpiresIn;
  issued_token_type: "urn:ietf:params:oauth:token-type:access_token";
  refresh_count: RefreshCount;
  refresh_token: RefreshToken;
  refresh_token_expires_in: RefreshTokenExpiresIn;
  token_type: "Bearer";
};
