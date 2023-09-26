"use client"
import { useRefreshToken } from '@/lib/hooks/useRefreshToken';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
// import { useRefreshToken } from '@/lib/hooks/useRefreshToken';
// import { useEffect } from 'react';
// import { useSession } from 'next-auth/react';

export interface FetchError extends AxiosError {}

const hostname = 'app-ibb.onrender.com'
export const BASE_URL = `https://${hostname}`

// export async function fetchWithToken(
//   url: string,
//   methodType: 'GET' | 'POST' | 'PUT' | 'DELETE',
//   token: string,
// ) {
//   const refreshToken = useRefreshToken()

//   try {
//     console.log('fetchWithToken called with URL:', url)
//     const response = await axios({
//       method: methodType,
//       url: url,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log('fetchWithToken response data:', response.data)
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;
//       if (axiosError.response?.status === 401) {
//         // Token expirado, tentar obter um novo token com refreshToken
//         try {
//           const newToken = await refreshToken();
//           // Reenviar a solicitação com o novo token
//           const newResponse = await axios({
//             method: methodType,
//             url: url,
//             headers: {
//               Authorization: `Bearer ${newToken}`,
//             },
//           });
//           return newResponse.data;
//         } catch (refreshError) {
//           console.error('Failed to refresh token:', refreshError);
//           throw new Error('Failed to fetch data with token.');
//         }
//       }
//     }

//     console.error('Unknown error occurred:', error);
//     throw new Error('Unknown error occurred.');
//   }
// }

// export async function fetchWithToken(
//   url: string,
//   methodType: 'GET' | 'POST' | 'PUT' | 'DELETE', // Aceita os tipos de método axios permitidos
//   token: string
// ) {
//   const { data: session } = useSession()
//   const refreshToken = useRefreshToken()

//   useEffect(() => {
//     const request = axios.interceptors.request.use((config) => {
//       if (!config.headers["Authorization"]) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//       }
//       if (!config.method) {
//         config.method = methodType;
//       }
//       if (!config.url) {
//         config.url = url;
//       }
//       return config
//     },
//     (error) => Promise.reject(error)
//     )

//   }, [session])
//   }


// export interface FetchError extends AxiosError {}

// const hostname = 'app-ibb.onrender.com'
// export const BASE_URL = `https://${hostname}`

export async function fetchWithToken(
  url: string,
  methodType: 'GET' | 'POST' | 'PUT' | 'DELETE', // Aceita os tipos de método axios permitidos
  token: string
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
  });

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
  });
