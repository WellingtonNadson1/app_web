'use client'

import { useSession } from "next-auth/react"
import axios from "../axios"
import dayjs from "dayjs"

interface INewRefreshToken {
  id: string
  expiresIn: number
  userIdRefresh: string
}

export const useRefreshToken = () => {
  const { data: session } = useSession()

  const refreshToken = async () => {

    if (session?.user.token && session?.user.refreshToken) {
      // Verificar se o token de acesso expirou
      const isTokenExpired = dayjs().isAfter(dayjs.unix(session?.user.refreshToken.expiresIn as number));

      if (isTokenExpired) {
        const response = await axios.post('/refresh-token', {
          refresh_token: session?.user.refreshToken.id
        })
        const newToken = response.data
        console.log('New Token Function Refresh', newToken)

        if (newToken.token && newToken.newRefreshToken) {
          session.user.token = newToken.token as string
          session.user.refreshToken = newToken.newRefreshToken as INewRefreshToken
        }
      }
    }

    // if (session?.user.token && session?.user.newRefreshToken) {
    //   // Verificar se o token de acesso expirou
    //   const isTokenExpired = dayjs().isAfter(dayjs.unix(session?.user.newRefreshToken.expiresIn as number));

    //   if (isTokenExpired) {
    //     const response = await axios.post('/refresh-token', {
    //       refresh_token: session?.user.newRefreshToken.id
    //     })
    //     const newToken = response.data
    //     console.log('New Token Function NewRefresh', newToken)

    //     if (newToken) session.user.token = response.data.token
    //   }
    // }


  }
  return refreshToken
}
