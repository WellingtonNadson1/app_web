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
      // Implementando autenticação com API propria
      async authorize(credentials, req): Promise<any> {
        if (!credentials!.email || !credentials!.password) {
          return null
        }
        const hostname = 'app-ibb.onrender.com'
        const URL = `https://${hostname}/login`
        const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        })
        const user = await response.json()

        if (user && response.ok) {
          console.log(JSON.stringify(user))
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
  // callbacks: {
  //   async jwt({ token, user }) {
  //     user && (token.user = user)
  //     return token
  //   },
  //   async session({ session, token }) {
  //     session.user = token.user as any
  //     return session
  //   },

  // },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
        token.refreshToken = account.refreshToken;
      }

      if (token?.accessToken && token?.refreshToken) {
        const hostname = 'app-ibb.onrender.com'
        const URL = `https://${hostname}/refresh-token`
        const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.accessToken}`
          },
          body: JSON.stringify({
            refresh_token: token?.refreshToken,
          }),
        })
        const newToken = await response.json()

        if (newToken && response.ok) {
          console.log(JSON.stringify(newToken))
          token.accessToken = newToken.accessToken;
        }
      }

      user && (token.user = user)
      return token
    },
    async session({ session, token }) {
      session.user = token.user as any
      return session
    },
  },

}
