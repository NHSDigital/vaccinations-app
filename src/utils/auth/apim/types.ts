import { Brand } from "@src/utils/types";

export type AccessToken = Brand<string, "AccessToken">;
export type RefreshToken = Brand<string, "RefreshToken">;
export type ExpiresIn = Brand<string, "ExpiresIn">;
export type RefreshCount = Brand<string, "RefreshCount">;
export type RefreshTokenExpiresIn = Brand<string, "RefreshTokenExpiresIn">;

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
