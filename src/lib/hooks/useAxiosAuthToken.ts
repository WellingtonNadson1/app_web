"use client"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { axiosAuthToken } from "../axios"
import { useRefreshToken } from "./useRefreshToken"
import { AxiosInstance } from "axios"

const useAxiosAuthToken = (token: string): AxiosInstance => {
  const { data: session } = useSession()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    const requestIntercept = axiosAuthToken.interceptors.request.use((config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
    )

    const responseIntercept = axiosAuthToken.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config
        if (error.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true
          try {
            // Obtenha um novo token de acesso usando refreshToken
            const newToken = await refreshToken();
            prevRequest.headers["Authorization"] = `Bearer ${newToken}`
            return axiosAuthToken(prevRequest)
          }
          catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            return Promise.reject(error);
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosAuthToken.interceptors.request.eject(requestIntercept)
      axiosAuthToken.interceptors.response.eject(responseIntercept)
    }
  }, [session])

  return axiosAuthToken
}

export default useAxiosAuthToken
