// "use client"
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type RefreshToken = {
  id: string
  expiresIn: number
  userIdRefresh: string
}

type NewRefreshToken = {
  id: string
  expiresIn: number
  userIdRefresh: string
}

type ActionsProps = {
  setId: (id: string) => void;
  setRole: (role: string) => void;
  setEmail: (email: string) => void;
  setImageURL: (image_url: string) => void;
  setFirstName: (first_name: string) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: RefreshToken) => void;
}

type UserDataStore = {
  state: {
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
  };
  actions: ActionsProps;
};

export const useUserDataStore = create(persist<UserDataStore>(
  (set) => ({
    state: {
      id: '',
      role: '',
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
      }
    },
    actions: {
      setId: (id) =>
        set((state) => ({
          ...state,
          state: {
            ...state.state,
            id: id
          }
        })),

      setRole: (role) =>
        set((state) => ({
          ...state,
          state: {
            ...state.state,
            escolas: role
          }
        })),

      setEmail: (email) =>
        set((state) => ({
          ...state,
          state: {
            ...state.state,
            econtros: email
          }
        })),

      setImageURL: (image_url) =>
        set((state) => ({
          ...state,
          state: {
            ...state.state,
            image_url: image_url
          }
        })),
      setFirstName: (first_name) =>
        set((state) => ({
          ...state,
          state: {
            ...state.state,
            first_name: first_name
          }
        })),
      setToken: (token) =>
        set((state) => ({
          ...state,
          state: {
            ...state.state,
            token: token
          }
        })),
      setRefreshToken: (refreshToken) =>
        set((state) => ({
          ...state,
          state: {
            ...state.state,
            refreshToken: {
              ...state.state.refreshToken, refreshToken
            }
          }
        })),
    }
  }),
  {
    name: 'data-user',
    storage: createJSONStorage(() => localStorage)
  }
))
