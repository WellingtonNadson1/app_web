import { toast } from 'react-toastify'

export interface FetchError extends Error {
  status?: number
}

export async function fetchWithToken(url: string, token: string) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error: FetchError = new Error('Failed to fetch data with token.')
      error.status = response.status
      throw error
    }
    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error while fetching data with token:', error.message)
      throw error
    } else {
      console.error('Unknown error occurred:', error)
      throw new Error('Unknown error occurred.')
    }
  }
}

// Notification sucsses or error Submit Forms
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
