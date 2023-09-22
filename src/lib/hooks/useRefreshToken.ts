'use client'

import { useSession } from "next-auth/react"
import axios from "../axios"

export const useRefreshToken = () => {
  const { data: session } = useSession()

  const refreshToken = async () => {
    const response = await axios.post('/refresh-token', {
      refresh_token: session?.user.refreshToken.id
    })

    if (session) session.user.token = response.data.token
  }
  return refreshToken
}
