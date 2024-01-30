"use client"
import { useRef } from "react";
import { useUserDataStore } from "./UserDataStore";

type InitializerUserStoreProps = {
  id: string
  role: string
  email: string
  image_url: string
  first_name: string
  token: string
  refreshToken: {
    id: string
    expiresIn: number
    userIdRefresh: string
  }
}

export const InitializerUserStore = ({ id, role, email, image_url, first_name, token, refreshToken }: InitializerUserStoreProps) => {
  const initializerUser = useRef(false)

  if (!initializerUser.current) {
    useUserDataStore.setState({
      state: {
        id, role, email, image_url, first_name, token, refreshToken
      }
    })
  }
  return null
}
