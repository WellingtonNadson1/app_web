'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, useSession } from 'next-auth/react'
import React from 'react'

interface IProps {
  children: React.ReactNode,

}

const { data: session } = useSession()

export const Providers = ({ children }: IProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

const queryClient = new QueryClient()
export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
