'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'

interface IProps {
  children: React.ReactNode,
}

const queryClient = new QueryClient()

export const Providers = ({ children }: IProps) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}
