import authConfig from '@/auth/auth.config';
import axios, { AxiosError } from 'axios';
import NextAuth from 'next-auth';

export interface FetchError extends AxiosError {}

export async function fetchWithToken(
  url: string,
  methodType: 'GET' | 'POST' | 'PUT' | 'DELETE', // Aceita os tipos de método axios permitidos
  token: string,
) {
  try {
    const response = await axios({
      method: methodType, // Usa o método passado como parâmetro
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fetchError: FetchError = {
        ...error,
        message: 'Failed to fetch data with token.',
      };
      throw fetchError;
    } else {
      console.error('Unknown error occurred:', error);
      throw new Error('Unknown error occurred.');
    }
  }
}

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  return console.log('isLoggedIn', isLoggedIn);
});
