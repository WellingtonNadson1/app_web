// "use client"
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type RefreshToken = {
  id: string
  expiresIn: number
  userIdRefresh: string
}

export type UserRoles = {
  rolenew: {
    name: string
  }
}

type ActionsProps = {
  setId: (id: string) => void
  setRole: (role: string) => void
  setUserRoles: (user_roles: UserRoles) => void
  setEmail: (email: string) => void
  setImageURL: (image_url: string) => void
  setFirstName: (first_name: string) => void
  setToken: (token: string) => void
  setRefreshToken: (refreshToken: RefreshToken) => void
}

type UserDataStore = {
  id: string
  role: string
  user_roles: UserRoles[]
  email: string
  image_url: string
  first_name: string
  token: string
  refreshToken: {
    id: string
    expiresIn: number
    userIdRefresh: string
  }
  actions: ActionsProps
}

export const useUserDataStore = create(
  persist<UserDataStore>(
    (set) => ({
      id: '',
      role: '',
      user_roles: [],
      email: '',
      image_url: '',
      first_name: '',
      token: '',
      refreshToken: {
        id: '',
        expiresIn: 0,
        userIdRefresh: '',
      },
      newRefreshToken: {
        id: '',
        expiresIn: 0,
        userIdRefresh: '',
      },
      actions: {
        setId: (id) =>
          set((state) => ({
            ...state,
            state: {
              ...state,
              id: id,
            },
          })),

        setRole: (role) =>
          set((state) => ({
            ...state,
            state: {
              ...state,
              role,
            },
          })),

        setUserRoles: (user_roles) =>
          set((state) => ({
            ...state,
            state: {
              ...state,
              user_roles: [...state.user_roles, user_roles],
            },
          })),

        setEmail: (email) =>
          set((state) => ({
            ...state,
            state: {
              ...state,
              email,
            },
          })),

        setImageURL: (image_url) =>
          set((state) => ({
            ...state,
            state: {
              ...state,
              image_url,
            },
          })),
        setFirstName: (first_name) =>
          set((state) => ({
            ...state,
            state: {
              ...state,
              first_name,
            },
          })),
        setToken: (token) =>
          set((state) => ({
            ...state,
            state: {
              ...state,
              token,
            },
          })),
        setRefreshToken: (refreshToken) =>
          set((state) => ({
            ...state,
            state: {
              ...state,
              refreshToken: {
                ...state.refreshToken,
                refreshToken,
              },
            },
          })),
      },
    }),
    {
      name: 'data-user',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
