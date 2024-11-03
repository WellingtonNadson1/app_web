import authConfig from '@/auth/auth.config'
import axios, { AxiosError } from 'axios'
import NextAuth from 'next-auth'
import { NextAuthRequest } from 'next-auth/lib'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export interface FetchError extends AxiosError { }

// const hostname = 'backibb-production.up.railway.app'
// const hostname = 'app-ibb.onrender.com'
// const hostname = "back-ibb.vercel.app";
// const hostnameLocal = "localhost:8080";

export const BASE_URL =
  process.env.HOSTNAME_URL || 'https://back-ibb.vercel.app'
export const BASE_URL_LOCAL =
  process.env.HOSTNAME_URL_LOCAL || 'http://localhost:8080'

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
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fetchError: FetchError = {
        ...error,
        message: 'Failed to fetch data with token.',
      }
      throw fetchError
    } else {
      console.error('Unknown error occurred:', error)
      throw new Error('Unknown error occurred.')
    }
  }
}

// Notification success or error Submit Forms
export const success = (message: string) =>
  toast.success(`${message}`, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })

export const errorCadastro = (message: string) =>
  toast.error(`${message}`, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })

const { auth } = NextAuth(authConfig)

export default auth((req: NextAuthRequest) => {
  // const { nextUrl } = req;
  const isLoggedIn = !!req.auth
  return console.log('isLoggedIn', isLoggedIn)
})
