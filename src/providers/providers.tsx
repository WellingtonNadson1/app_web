'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

interface IProps {
  children: React.ReactNode,

}

export const Providers = ({ children }: IProps) => {
  return <SessionProvider>{children}</SessionProvider>
}

const queryClient = new QueryClient()
export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
