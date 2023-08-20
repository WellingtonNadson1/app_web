import Header from '@/components/Header'
import Sidebar from '@/components/sidebar/Sidebar'
import { Providers } from '@/providers/providers'
// import { getServerSession } from 'next-auth'
// import { RedirectType } from 'next/dist/client/components/redirect'
// import { redirect } from 'next/navigation'
// import { authOptions } from '../api/auth/[...nextauth]/auth'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'
import './globals.css'

export const metadata = {
  title: 'App IBB',
  description: 'Criado para auxiliar no controle e desenvolvimento da IBB',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const session = await getServerSession(authOptions)

  // if (!session) {
  //   // Signed in
  //   console.log(session)
  //   return redirect('/login', RedirectType.replace)
  // }

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
          <div className="absolute top-0 -z-0 min-h-[18.75rem] w-screen bg-[#1D70B6]/90"></div>
          <div className="flex min-h-screen bg-slate-100">
            <Providers>
              <Sidebar />
              <div className="mx-auto w-full px-2 py-2">
                <Header />
                {children}
              </div>
            </Providers>
          </div>
        </div>
      </body>
    </html>
  )
}
