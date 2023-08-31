import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { Providers } from '@/providers/providers'
import { getServerSession } from 'next-auth'
import { RedirectType } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'
import '../globals.css'

export const metadata = {
  title: 'App IBB',
  description: 'Criado para auxiliar no controle e desenvolvimento da IBB',
}

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  console.log('Session Role: ', session?.user.role)

  if (session?.user.role === 'USERCENTRAL') {
    // Signed in
    return redirect('/dashboard', RedirectType.replace)
  }
  if (session?.user.role === 'USERLIDER') {
    // Signed in
    return redirect('/celula', RedirectType.replace)
  }
  if (session?.user.role === 'MEMBER') {
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
