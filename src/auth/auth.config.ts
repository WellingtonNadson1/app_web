import axios from "@/lib/axios";
import { loginSchema } from "@/types";
import { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";

export default {
  providers: [
    credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials, req): Promise<any> {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials)

          const result = await axios.post('/login', {
            email: email,
            password: password,
          });

          const user = result.data

          if (user) {
            console.log(JSON.stringify(user))
            return user
          }

        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null
          }

        }
      }
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
  ]
} satisfies NextAuthConfig
