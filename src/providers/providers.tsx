'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

interface IProps {
  children: React.ReactNode,
}

const queryClient = new QueryClient()

export const Providers = ({ children }: IProps) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}
