import '@/app/globals.css';
import { auth } from '@/auth';
import DynamicBreadcrumbs from '@/components/DynamicBreadcrumbs';
import Header from '@/components/Header';
import MySidebar from '@/components/sidebar/MySidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Providers } from '@/providers/providers';
import { InitializerUserStore } from '@/store/InitializerUserStore';
import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import React, { Suspense } from 'react';
import { LoaderHeader } from './loading';

export const metadata = {
  title: 'App IBB',
  description: 'Criado para auxiliar no controle e desenvolvimento da IBB',
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log('session', session);

  if (!session) {
    // Signed in
    return redirect('/login', RedirectType.replace);
  }

  const id = session?.user?.id;
  const role = session?.user?.role;
  const user_roles = session?.user?.user_roles;
  const email = session?.user?.token;
  const image_url = session?.user?.image_url;
  const first_name = session?.user?.first_name;
  const token = session?.user?.token;
  const refreshToken = session?.user?.refreshToken;

  return (
    <html lang="pt">
      <header
        suppressHydrationWarning
        className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div suppressHydrationWarning className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumbs />
        </div>
      </header>
      <body suppressHydrationWarning>
        <InitializerUserStore
          id={id ?? ''}
          role={role ?? ''}
          user_roles={user_roles ?? []}
          email={email ?? ''}
          image_url={image_url ?? ''}
          first_name={first_name ?? ''}
          token={token ?? ''}
          refreshToken={
            refreshToken ?? { id: '', expiresIn: 0, userIdRefresh: '' }
          }
        />
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
        <div suppressHydrationWarning>
          <div className="z-0 absolute top-0 min-h-[18.75rem] w-full bg-[#1D70B6]/90"></div>
          <div className="flex min-h-screen bg-slate-100">
            <SidebarProvider>
              <Providers>
                <MySidebar />
                <div
                  suppressHydrationWarning
                  className="z-30 w-full px-2 py-2 mx-auto"
                >
                  <Suspense fallback={<LoaderHeader />}>
                    <Header />
                  </Suspense>
                  {children}
                </div>
              </Providers>
            </SidebarProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
