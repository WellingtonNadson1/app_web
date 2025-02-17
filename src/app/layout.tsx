import '@/./app/globals.css';
import { Providers } from '@/providers/providers';
import React from 'react';
import BreadcrumbsSlot from './@breadcrumbs/[...catchAll]/page';

export const metadata = {
  title: 'App IBB',
  description: 'Criado para auxiliar no controle e desenvolvimento da IBB',
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <BreadcrumbsSlot />
          {children}
        </Providers>
      </body>
    </html>
  );
}
