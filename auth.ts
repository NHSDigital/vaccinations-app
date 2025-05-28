import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import NextAuth, { type DefaultSession } from "next-auth";
import "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import { Logger } from "pino";

export interface DecodedToken {
  iss: string;
  aud: string;
  identity_proofing_level: string;
}

// Augmenting types. Ref https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      nhs_number: string,
      birthdate: string,
    } & DefaultSession["user"]
  }

  interface Profile {
    nhs_number: string,
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      nhs_number: string,
      birthdate: string
    }
  }
}


const log: Logger = logger.child({ module: "auth" });

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  return {
    providers: [await NHSLoginAuthProvider()],
    pages: {
      signIn: SSO_FAILURE_ROUTE,
      signOut: SESSION_LOGOUT_ROUTE,
      error: SSO_FAILURE_ROUTE,
      verifyRequest: SSO_FAILURE_ROUTE,
      newUser: SSO_FAILURE_ROUTE
    },
    trustHost: true,
    callbacks: {
      async signIn({ account }) {
        if (!account || typeof account.id_token !== "string") {
          log.info("Access denied from signIn callback. Account or id_token missing.");
          return false;
        }

        const decodedToken = jwtDecode<DecodedToken>(account.id_token);
        const { iss, aud, identity_proofing_level } = decodedToken;
        const configs: AppConfig = await configProvider();

        const isValidToken =
          iss === configs.NHS_LOGIN_URL &&
          aud === configs.NHS_LOGIN_CLIENT_ID &&
          identity_proofing_level === "P9";

        if (!isValidToken) {
          log.info(`Access denied from signIn callback. iss: ${iss}, aud: ${aud}, identity_proofing_level: ${identity_proofing_level}`);
        }
        return isValidToken;
      },
      async jwt({ token, account, profile}) {
        if(account && profile && token) {
          token.user = {
            nhs_number: profile.nhs_number,
            // TODO: How to handle the cases where nsh_number and birthdate are not present?
            birthdate: profile.birthdate!,
          };
        }

        return token;
      },
      async session({ session, token }) {
        if(token?.user && session.user) {
          session.user.nhs_number = token.user.nhs_number;
          session.user.birthdate = token.user.birthdate;
        }
        return session;
      }
    },
  };
});
