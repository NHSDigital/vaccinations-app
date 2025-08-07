import { NhsNumber } from "@src/models/vaccine";
import { Brand } from "@src/utils/types";
import type { DefaultSession } from "next-auth";

export type AccessToken = Brand<string, "AccessToken">;
export type RefreshToken = Brand<string, "RefreshToken">;
export type ExpiresIn = Brand<string, "ExpiresIn">;
export type ExpiresAt = Brand<number, "ExpiresAt">;
export type RefreshCount = Brand<string, "RefreshCount">;
export type RefreshTokenExpiresIn = Brand<string, "RefreshTokenExpiresIn">;
export type RefreshTokenExpiresAt = Brand<number, "RefreshTokenExpiresAt">;
export type IdToken = Brand<string, "IdToken">;
export type BirthDate = Brand<string, "BirthDate">;
export type NowInSeconds = Brand<number, "NowInSeconds">;
export type MaxAgeInSeconds = Brand<number, "MaxAgeInSeconds">;
export type ExpiresSoonAt = Brand<number, "ExpiresSoonAt">;
export type RefreshTokenExpiresSoonAt = Brand<number, "RefreshTokenExpiresSoonAt">;

export interface DecodedIdToken {
  iss: string;
  aud: string;
  identity_proofing_level: string;
  jti: string;
}

export type APIMClientAssertionPayload = {
  iss: string;
  sub: string;
  aud: string;
  jti: string;
  exp: number;
};

export type APIMNewTokenPayload = {
  grant_type: "urn:ietf:params:oauth:grant-type:token-exchange";
  subject_token_type: "urn:ietf:params:oauth:token-type:id_token";
  client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
  subject_token: string;
  client_assertion: string;
};

export type APIMRefreshTokenPayload = {
  grant_type: "urn:ietf:params:oauth:grant-type:refresh_token";
  client_id: string;
  client_secret: string;
  refresh_token: RefreshToken;
};

export type APIMTokenPayload = APIMNewTokenPayload | APIMRefreshTokenPayload;

export type AssertedLoginIdentityPayload = {
  code: string;
};

// Augmenting types. Ref https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      nhs_number: NhsNumber;
      birthdate: BirthDate;
    } & DefaultSession["user"];
    //TODO VIA-254 - remove this once we are finished.
    nhs_login: {
      id_token: IdToken;
    };
  }

  interface Profile {
    nhs_number: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      nhs_number: NhsNumber;
      birthdate: BirthDate;
    };
    nhs_login: {
      id_token: IdToken;
    };
    apim: {
      access_token: AccessToken;
      expires_at: ExpiresAt;
      refresh_token: RefreshToken;
      refresh_token_expires_at: RefreshTokenExpiresAt;
    };
    fixedExpiry: number;
  }
}
