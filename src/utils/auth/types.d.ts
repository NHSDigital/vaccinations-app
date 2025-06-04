import type { DefaultSession } from "next-auth";

export interface DecodedIdToken {
  iss: string;
  aud: string;
  identity_proofing_level: string;
  jti: string;
}

// Augmenting types. Ref https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      nhs_number: string;
      birthdate: string;
      access_token: string;
      id_token: {
        jti: string;
      };
    } & DefaultSession["user"];
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
    expires_at: number;
    refresh_token: string;
    access_token: string;
    id_token: {
      jti: string;
    };
    fixedExpiry: number;
  }
}
