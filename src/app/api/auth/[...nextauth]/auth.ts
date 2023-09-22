import axios from '@/lib/axios'
import dayjs from 'dayjs'
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
    async jwt({ token, user, account }) {
      console.log({ account })
      return {...token, ...user}
    },

    async session({ session, token, user }) {
      session.user = token as any
      return session
    }
  }
  // callbacks: {
  //   async jwt({ token, user, account }) {
  //     if (account?.accessToken) {
  //       token.accessToken = account.accessToken;
  //       token.refreshToken = account.refreshToken;
  //       // Adicione a data de expiração ao token
  //       token.expiresIn = account.expiresIn;
  //     }

  //     if (token?.accessToken && token?.refreshToken) {
  //       // Verificar se o token de acesso expirou
  //       const isTokenExpired = dayjs().isAfter(dayjs.unix(token.expiresIn as number));

  //       if (isTokenExpired) {
  //         const hostname = 'app-ibb.onrender.com'
  //         const URL = `https://${hostname}/refresh-token`
  //         const response = await fetch(URL, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${token.accessToken}`
  //           },
  //           body: JSON.stringify({
  //             refresh_token: token?.refreshToken,
  //           }),
  //         })

  //         if (response.ok) {
  //           const newToken = await response.json()
  //           console.log(JSON.stringify(newToken))
  //           token.accessToken = newToken.accessToken;
  //           // Atualizar o refreshToken se um novo for retornado
  //           if (newToken.newRefreshToken) {
  //             token.refreshToken = newToken.newRefreshToken;
  //             // Atualizar a data de expiração
  //             token.expiresIn = newToken.expiresIn;
  //           }
  //         } else {
  //           // Limpar os tokens se a atualização falhar
  //           delete token.accessToken;
  //           delete token.refreshToken;
  //         }
  //       }
  //     }

  //     user && (token.user = user)
  //     return token
  //   },
  //   async session({ session, token }) {
  //     session.user = token.user as any
  //     return session
  //   },
  // },


}
