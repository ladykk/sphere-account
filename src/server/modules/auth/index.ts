import db from "@/db";
import { env } from "@/env/server.mjs";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { userCredentials, users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const EmailPasswordProvider = CredentialsProvider({
  id: "email-password",
  name: "Email & Password",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    // Return null if user credentials are invalid
    if (!credentials?.email && !credentials?.password) {
      console.error("[Auth]: Bad credentials");
      return null;
    }

    // Find user by email
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        password: userCredentials.password,
      })
      .from(users)
      .innerJoin(userCredentials, eq(users.id, userCredentials.userId))
      .where(eq(users.email, credentials.email))
      .limit(1);

    // Return null if user not found
    if (user.length <= 0) {
      console.error(
        `[Auth]: User with email: "${credentials.email}" not found.`
      );
      return null;
    }

    const isPass = await bcrypt.compare(credentials.password, user[0].password);

    if (!isPass) {
      console.error(
        `[Auth]: User with email: "${credentials.email}" password not match.`
      );
      return null;
    }

    console.info(
      `[Auth]: User with email: "${
        credentials.email
      }" login. (${new Date().toISOString()})`
    );
    return {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      image: user[0].image,
    };
  },
});

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    EmailPasswordProvider,
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    LineProvider({
      clientId: env.LINE_CLIENT_ID,
      clientSecret: env.LINE_CLIENT_SECRET,
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (!token.sub) {
        throw new Error("[Auth]: No User ID");
      }
      session.user.id = token.sub;

      return session;
    },
  },
};
