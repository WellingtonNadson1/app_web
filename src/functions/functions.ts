"use client"
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export interface FetchError extends AxiosError {}

const hostname = 'app-ibb.onrender.com'
export const BASE_URL = `https://${hostname}`

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





