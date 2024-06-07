import { Providers } from '@/providers/providers'
import { RedirectType } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'
import '../globals.css'
import { auth } from '@/auth'

export const metadata = {
  title: 'App IBB',
  description: 'Criado para auxiliar no controle e desenvolvimento da IBB',
}

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const roles = session?.user.user_roles;

  if (roles?.some(role => role.rolenew.name === "USERSUPERVISOR") && roles.some(role => role.rolenew.name === "USERLIDER")) {
    // Redireciona para supervisão
    return redirect('/celula', RedirectType.replace);
  }

  if (roles?.some(role => role.rolenew.name === 'USERSUPERVISOR')) {
    // Signed in
    return redirect('/supervisao', RedirectType.replace);
  }
  if (roles?.some(role => role.rolenew.name === 'USERLIDER')) {
    // Signed in
    return redirect('/celula', RedirectType.replace);
  }
  if (roles?.some(role => role.rolenew.name === 'MEMBER')) {
    // Signed in
    return redirect('/login', RedirectType.replace);
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
