'use client'

import { useSession } from "next-auth/react"
import axios from "../axios"
import dayjs from "dayjs"
import { decode } from "jsonwebtoken"

interface INewRefreshToken {
  id: string
  expiresIn: number
  userIdRefresh: string
}

export const useRefreshToken = () => {
  const { data: session, update } = useSession()

  const refreshToken = async () => {

    if (session?.user.token && session?.user.refreshToken) {
      // Verificar se o token de acesso expirou
      const decoded = decode(session?.user.token)
      if (typeof decoded === 'object' && decoded !== null && 'exp' in decoded) {
        if (decoded.exp !== undefined) {
          const isTokenExpired = dayjs().isAfter(dayjs.unix(decoded.exp));

          console.log('Is token expired', isTokenExpired);

          if (isTokenExpired) {
            const response = await axios.post('/refresh-token', {
              refresh_token: session?.user.refreshToken.id
            })
            const newToken = response.data
            console.log('New Token Function Refresh', newToken)

            // Processo para realizar autalização da session
            if (newToken.token && newToken.newRefreshToken) {
              const handleUpdateUser = async () => {
                const newSession = {
                  ...session,
                  user: {
                    ...session?.user,
                    token: newToken.token as string,
                    refreshToken: {
                      id: newToken.newRefreshToken.id,
                      expiresIn: newToken.newRefreshToken.expiresIn,
                      userIdRefresh: newToken.newRefreshToken.userIdRefresh
                    }
                  }
                }
                // Atualize a sessão
                await update(newSession)
              }
              handleUpdateUser()
            }
          }
        }
      }
    }
  }
  return refreshToken
}
