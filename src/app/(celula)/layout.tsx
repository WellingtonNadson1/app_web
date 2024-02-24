import { authOptions } from '../api/auth/[...nextauth]/auth'
import Sidebar from '@/components/sidebar/Sidebar'
import { Providers } from '@/providers/providers'
import { getServerSession } from 'next-auth'
import { RedirectType } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'
import './globals.css'
import { InitializerUserStore } from '@/store/InitializerUserStore'

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
  const id = session?.user.id
  const role = session?.user.role
  const user_roles = session?.user.user_roles;
  const email = session?.user.token
  const image_url = session?.user.image_url
  const first_name = session?.user.first_name
  const token = session?.user.token
  const refreshToken = session?.user.refreshToken

  return (
    <html lang="pt">
      <body>
        <div className="overflow-x-auto overflow-y-auto">
          <div className="absolute top-0 min-h-[18.75rem] w-screen dark:bg-gray-700 bg-[#1D70B6]/90"></div>
          <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
            <InitializerUserStore
              id={id ?? ''}
              role={role ?? ''}
              user_roles={user_roles ?? []}
              email={email ?? ''}
              image_url={image_url ?? ''}
              first_name={first_name ?? ''}
              token={token ?? ''}
              refreshToken={refreshToken ?? { id: '', expiresIn: 0, userIdRefresh: '' }}
            />
            <Providers>
              <Sidebar />
              <NextTopLoader
                color="#FFFF00"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #FFFF00,0 0 5px #FFFF00"
              />
              <div className="w-full px-2 py-2 mx-auto">{children}</div>
            </Providers>
          </div>
        </div>
      </body>
    </html>
  )
}
