import '@/app/globals.css'

export const metadata = {
  title: 'App IBB',
  description: 'Criado para auxiliar no controle e desenvolvimento da IBB',
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
}

export default function RootLayout({
  children,
  breadcrumbs,
}: {
  children: React.ReactNode,
  breadcrumbs: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body>
        {breadcrumbs}
        {children}
      </body>
    </html>
  )
}
