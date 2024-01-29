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
import bcrypt from "bcrypt"
// const bcrypt = require('bcrypt');


const EmailPasswordProvider = CredentialsProvider({
  id: "email-password",
  name: "Email & Password",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    // TODO: Authenticate logic
    try {

      if (credentials && credentials.password && typeof credentials.email === "string") {
        // const user = await db
        //   .select({ id: users.id, name: users.name, email: users.email, image: users.image }).from(users)
        //   .where(eq(users.email, credentials.email))
        //   .limit(1);
        // const userPassword = await db
        //   .select({ password: userCredentials.password }).from(userCredentials)
        //   .where(eq(userCredentials.userId, user[0].id))
        //   .limit(1);

        const user = await db
          .select({ id: users.id, name: users.name, email: users.email, image: users.image, password: userCredentials.password })
          .from(users)
          .innerJoin(userCredentials, eq(users.id, userCredentials.userId))
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (user.length > 0) {
          const decryptedPassword = await bcrypt.compare(credentials.password, user[0].password);
          if (decryptedPassword) {
            return { id: user[0].id, name: user[0].name, email: user[0].email, image: user[0].image }

          } else {
            console.log('Incorrect Password:');
            return null
          }
        }
      } else {
        console.log('Authentication error:');
        return null
      }
      return null;
    } catch (error) {
      console.log('Authentication error:', error);
      return null
    }

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
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  callbacks: {
    session: async ({ session, token, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
};
