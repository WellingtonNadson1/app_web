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
          await refreshToken()
          prevRequest.headers["Authorization"] = `Bearer ${token}`
          return axiosAuthToken(prevRequest)
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
