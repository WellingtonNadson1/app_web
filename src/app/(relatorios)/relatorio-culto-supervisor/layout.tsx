// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import Header from '@/components/Header'
import Sidebar from '@/components/sidebar/Sidebar'
import { Providers } from '@/providers/providers'
import { RedirectType } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import React, { Suspense } from 'react'
import '@/./app/globals.css'
import { LoaderHeader } from '@/app/(central)/loading'
import { auth } from '@/auth'

export const metadata = {
  title: 'App IBB',
  description: 'Criado para auxiliar no controle e desenvolvimento da IBB',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    // Signed in
    return redirect('/login', RedirectType.replace)
  }

  return (
    <html lang="pt">
      <body>
        <NextTopLoader
          color="#fff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #fff,0 0 5px #fff"
        />
        <div className="overflow-x-auto overflow-y-auto">
          <div className="absolute top-0 min-h-[18.75rem]"></div>
          <div className="flex min-h-screen bg-white">
            <Providers>
              {children}
            </Providers>
          </div>
        </div>
      </body>
    </html>
  )
}
