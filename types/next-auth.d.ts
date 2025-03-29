import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's ID */
      id: string;
      /** The user's type (customer or business) */
      userType: string;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the OAuth sign-in callback
   */
  interface User {
    /** The user's ID */
    id: string;
    /** The user's type (customer or business) */
    userType: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's ID */
    id: string;
    /** The user's type (customer or business) */
    userType: string;
  }
}
