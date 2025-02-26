import { loginSchema } from '@/types';
import axios from 'axios';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { ZodError } from 'zod';
import { cookies } from 'next/headers';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: { label: 'Senha', type: 'password' },
      },
      authorize: async (credentials, req) => {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          // Ajuste a URL para o endpoint correto da sua API
          const result = await axios.post(
            `${process.env.NEXT_PUBLIC_HOSTNAME_URL}/login`,
            {
              email: email,
              password: password,
            },
          );

          const user = result.data;

          if (!user || !user.token) {
            throw new Error('Invalid credentials.');
          }

          const userRoles = user.user_roles;

          const cookieStore = cookies();

          // Armazena o token e os papéis no cookie usando nookies
          // Armazena apenas o token no cookie
          cookieStore.set('session_token', user.token, {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24,
          });

          // Armazena o array como JSON stringificado
          cookieStore.set('user_roles', JSON.stringify(userRoles), {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24,
          });
          if (user) {
            console.log(JSON.stringify(user));
            return user; // Retorna o usuário para o NextAuth
          }
        } catch (error) {
          console.error('Erro na requisição ao /login:', error);
          if (error instanceof ZodError) {
            return null; // Credenciais inválidas
          }
          throw new Error('Authorization failed');
        }
      },
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
      if (trigger === 'update' && session) {
        return { ...token, ...session?.user };
      }
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user.token = token as any;
      return session;
    },
  },
});
