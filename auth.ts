import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  return { providers: [await NHSLoginAuthProvider()] };
});
