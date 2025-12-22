import { AgeGroup } from "@src/models/ageBasedHub";
import { NhsNumber } from "@src/models/vaccine";
import { Brand } from "@src/utils/types";
import type { DefaultSession } from "next-auth";

export type AccessToken = Brand<string, "AccessToken">;
export type ExpiresIn = Brand<string, "ExpiresIn">;
export type ExpiresAt = Brand<number, "ExpiresAt">;
export type IdToken = Brand<string, "IdToken">;
export type BirthDate = Brand<string, "BirthDate">;
export type Age = Brand<number, "Age">;
export type NowInSeconds = Brand<number, "NowInSeconds">;
export type MaxAgeInSeconds = Brand<number, "MaxAgeInSeconds">;
export type ExpiresSoonAt = Brand<number, "ExpiresSoonAt">;

export interface DecodedIdToken {
  iss: string;
  aud: string;
  identity_proofing_level: string;
  jti: string;
  vot: string;
}

export type APIMClientAssertionPayload = {
  iss: string;
  sub: string;
  aud: string;
  jti: string;
  exp: number;
};

export type APIMTokenPayload = {
  grant_type: "urn:ietf:params:oauth:grant-type:token-exchange";
  subject_token_type: "urn:ietf:params:oauth:token-type:id_token";
  client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
  subject_token: string;
  client_assertion: string;
};

export type AssertedLoginIdentityPayload = {
  code: string;
};

// Augmenting types. Ref https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      nhs_number: NhsNumber;
      age_group?: undefined | AgeGroup;
    } & DefaultSession["user"];
  }

  interface Profile {
    nhs_number: string;
    birthdate: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      nhs_number: NhsNumber;
      birthdate: BirthDate;
      age_group: AgeGroup;
    };
    nhs_login: {
      id_token: IdToken;
    };
    apim: {
      access_token: AccessToken;
      expires_at: ExpiresAt;
    };
    fixedExpiry: number;
  }
}
