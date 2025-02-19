import '@/./app/globals.css';
import { Providers } from '@/providers/providers';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'App IBB',
  description: 'Criado para auxiliar no controle e desenvolvimento da IBB',
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <div className="-z-40 absolute top-0 min-h-[18.75rem] w-full bg-[#1D70B6]/90"></div>
      <body suppressHydrationWarning className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
