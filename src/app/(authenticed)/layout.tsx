import Header from '@/components/Header'
import Sidebar from '@/components/sidebar/Sidebar'
import { Providers, ReactQueryProviders } from '@/providers/providers'
import { getServerSession } from 'next-auth'
import { RedirectType } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import React, { Suspense } from 'react'
import { authOptions } from '../api/auth/[...nextauth]/auth'
import './globals.css'
import HeaderLoad from '@/components/HeaderLoad'
import { LoaderHeader } from './loading'

export const metadata = {
  title: 'App IBB',
  description: 'Criado para auxiliar no controle e desenvolvimento da IBB',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    // Signed in
    return redirect('/login', RedirectType.replace)
  }

  return (
    <html lang="pt">
      <body>
        <NextTopLoader
          color="#ffffff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ffffff,0 0 5px #ffffff"
        />
        <div className="overflow-x-auto overflow-y-auto">
          <div className="absolute top-0 min-h-[18.75rem] w-screen bg-[#1D70B6]/90"></div>
          <div className="flex min-h-screen bg-slate-100">
            <ReactQueryProviders>
              <Providers>
                <Sidebar />
                <div className="mx-auto w-full px-2 py-2">
                  <Suspense fallback={<LoaderHeader />}>
                    <Header />
                  </Suspense>
                  {children}
                </div>
              </Providers>
            </ReactQueryProviders>
          </div>
        </div>
      </body>
    </html>
  )
}
