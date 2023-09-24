"use client"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { axiosAuth } from "../axios"
import { useRefreshToken } from "./useRefreshToken"
import { AxiosInstance } from "axios"

const useAxiosAuth = (): AxiosInstance => {
  const { data: session } = useSession()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use((config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${session?.user.token}`
      }
      return config
    },
    (error) => Promise.reject(error)
    )

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config
        if (error.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true
          await refreshToken()
          prevRequest.headers["Authorization"] = `Bearer ${session?.user.token}`
          return axiosAuth(prevRequest)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept)
      axiosAuth.interceptors.response.eject(responseIntercept)
    }
  }, [session])

  return axiosAuth
}

export default useAxiosAuth
