import type { DefaultSession } from "next-auth";

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
      nhs_number: string;
      birthdate: string;
    } & DefaultSession["user"];
    nhs_login: {
      id_token: string;
    };
    apim: {
      access_token: string;
      expires_in: number;
    };
  }

  interface Profile {
    nhs_number: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      nhs_number: string;
      birthdate: string;
    };
    nhs_login: {
      id_token: string;
    };
    apim: {
      access_token: string;
      expires_in: number;
      refresh_token: string;
      refresh_token_expires_in: number;
    };
    fixedExpiry: number;
  }
}
