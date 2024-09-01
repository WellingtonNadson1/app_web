import axios from "@/lib/axios";
import { loginSchema } from "@/types";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          const result = await axios.post("/login", {
            email: email,
            password: password,
          });

          const user = result.data;

          if (user) {
            console.log(JSON.stringify(user));
            return user;
          }
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, trigger, user, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});
