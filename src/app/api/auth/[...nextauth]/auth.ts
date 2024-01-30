import axios from '@/lib/axios'
import { useUserDataStore } from '@/store/UserDataStore'
import type { NextAuthOptions } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials, req): Promise<any> {
        if (!credentials!.email || !credentials!.password) {
          return null
        }

        const response = await axios.post('/login', {
          email: credentials?.email,
          password: credentials?.password,
        });

        const user = response.data

        if (user) {
          console.log(JSON.stringify(user))


          useUserDataStore.setState({
            state: {
              id: user.id,
              role: user.role,
              email: user.email,
              image_url: user.image_url,
              first_name: user.first_name,
              token: user.token,
              refreshToken: user.refreshToken,
            }
          })

          return user
        }
        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  callbacks: {
    async jwt({ token, trigger, user, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }
      return {...token, ...user}
    },

    async session({ session, token, user }) {
      session.user = token as any
      return session
    }
  }
}
