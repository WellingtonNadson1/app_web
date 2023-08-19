import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    console.log(request.nextUrl.pathname)
    console.log(request.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === 'USERLIDER',
    },
  },
)

export const config = { matcher: ['/celulas', '/relatorios'] }
