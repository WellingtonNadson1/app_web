import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_LOGIN_REDIRECT_CELULA,
  DEFAULT_LOGIN_REDIRECT_SUPERVISOR,
  privateRoutesCelula,
  privateRoutesCentral,
  privateRoutesSupervisor,
  privateRoutesSupervisorLider,
  publicRoutes,
} from '@/routes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { auth } from './auth'

function matchRoute(url: string, routes: string[]): boolean {
  return routes.some((route) => {
    const regex = new RegExp(
      `^${route
        .replace(/\?.*$/, '')
        .replace(/:[^\s/]+/g, '([\\w-]+)')}(\\?.*)?$`,
    )
    return regex.test(url)
  })
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await auth()

  const isLoggedIn = !!session
  const roleUser = session?.user?.user_roles // roleUser agora é um array de objetos com rolenew.name

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = matchRoute(pathname, publicRoutes)
  const isAuthRoute = matchRoute(pathname, authRoutes)

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isLoggedIn) {
    if (!roleUser || roleUser.length === 0) {
      return NextResponse.next()
    }

    // Função auxiliar para verificar se o array de roles contém um determinado nome
    const hasRole = (roleName: string) =>
      roleUser.some((role) => role.rolenew.name === roleName)

    // Função para redirecionar se a URL de destino for diferente da atual
    const redirectIfNeeded = (destinationUrl: string) => {
      const currentUrl = req.nextUrl.pathname
      if (currentUrl !== destinationUrl) {
        return NextResponse.redirect(new URL(destinationUrl, req.nextUrl))
      }
      return NextResponse.next() // Não redirecionar se já estiver na URL correta
    }

    // Verificar as rotas privadas e os papéis
    const isPrivateRouteCentral = privateRoutesCentral.includes(pathname)
    const isPrivateRouteCelula = privateRoutesCelula.includes(pathname)
    const isPrivateRouteSupervisor = privateRoutesSupervisor.includes(pathname)
    const isPrivateRouteSupervisorLider =
      privateRoutesSupervisorLider.includes(pathname)

    // Verificar se o usuário tem os dois papéis: "USERLIDER" e "USERSUPERVISOR"
    if (hasRole('USERLIDER') && hasRole('USERSUPERVISOR')) {
      // Rotas específicas para SupervisorLider
      if (isPrivateRouteSupervisorLider) {
        return NextResponse.next() // Pode acessar rotas tanto de Supervisor quanto de Líder
      }
    }

    // Verificações de rotas privadas
    if (isPrivateRouteCentral && !hasRole('USERCENTRAL')) {
      return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_SUPERVISOR)
    }
    if (isPrivateRouteCelula && !hasRole('USERLIDER')) {
      return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_SUPERVISOR)
    }
    if (isPrivateRouteSupervisor && !hasRole('USERSUPERVISOR')) {
      return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_CELULA)
    }

    // Evitar redirecionamentos infinitos
    if (
      (pathname === DEFAULT_LOGIN_REDIRECT_CELULA && hasRole('USERLIDER')) ||
      (pathname === DEFAULT_LOGIN_REDIRECT_SUPERVISOR &&
        hasRole('USERSUPERVISOR')) ||
      (pathname === DEFAULT_LOGIN_REDIRECT && hasRole('USERCENTRAL'))
    ) {
      return NextResponse.next()
    }

    // Redirecionar após login com base no papel
    if (isAuthRoute || isPublicRoute) {
      // Verificações individuais de cada papel
      if (hasRole('USERLIDER')) {
        return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_CELULA)
      } else if (hasRole('USERSUPERVISOR')) {
        return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_SUPERVISOR)
      } else if (hasRole('USERCENTRAL')) {
        return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT)
      } else {
        return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT)
      }
    }
  }
  return NextResponse.next()
}

// export default async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const session = await auth();

//   const isLoggedIn = !!session;
//   const roleUser = session?.user?.user_roles; // roleUser agora é um array de objetos com rolenew.name

//   const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
//   const isPublicRoute = matchRoute(pathname, publicRoutes);
//   const isAuthRoute = matchRoute(pathname, authRoutes);

//   if (isApiAuthRoute) {
//     return NextResponse.next();
//   }

//   if (!isLoggedIn && !isPublicRoute) {
//     return NextResponse.redirect(new URL("/login", req.nextUrl));
//   }

//   if (isLoggedIn) {
//     if (!roleUser || roleUser.length === 0) {
//       return NextResponse.next();
//     }

//     // Função auxiliar para verificar se o array de roles contém um determinado nome
//     const hasRole = (roleName: string) => roleUser.some((role) => role.rolenew.name === roleName);
//     console.log('hasRole', hasRole)
//     // Verificar as rotas privadas e os papéis
//     const isPrivateRouteCentral = privateRoutesCentral.includes(pathname);
//     const isPrivateRouteCelula = privateRoutesCelula.includes(pathname);
//     const isPrivateRouteSupervisor = privateRoutesSupervisor.includes(pathname);
//     const isPrivateRouteSupervisorLider = privateRoutesSupervisorLider.includes(pathname);

//     // Função para redirecionar se a URL de destino for diferente da atual
//     const redirectIfNeeded = (destinationUrl: string | URL) => {
//       const currentUrl = req.nextUrl.pathname;
//       if (currentUrl !== destinationUrl) {
//         return NextResponse.redirect(new URL(destinationUrl, req.nextUrl));
//       }
//       return NextResponse.next(); // Não redirecionar se já estiver na URL correta
//     };

//     // Verificar se o usuário tem os dois papéis: "USERLIDER" e "USERSUPERVISOR"
//     if (hasRole("USERLIDER") && hasRole("USERSUPERVISOR")) {
//       return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_SUPERVISOR_LIDER);
//     }

//     // Verificações de rotas privadas
//     if (isPrivateRouteCentral && !hasRole("USERCENTRAL")) {
//       return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_SUPERVISOR);
//     }
//     if (isPrivateRouteCelula && !hasRole("USERLIDER")) {
//       return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_SUPERVISOR);
//     }
//     if (isPrivateRouteSupervisor && !hasRole("USERSUPERVISOR")) {
//       return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_CELULA);
//     }

//     // Evitar redirecionamentos infinitos
//     if (
//       (pathname === DEFAULT_LOGIN_REDIRECT_CELULA && hasRole("USERLIDER")) ||
//       (pathname === DEFAULT_LOGIN_REDIRECT_SUPERVISOR && hasRole("USERSUPERVISOR")) ||
//       (pathname === DEFAULT_LOGIN_REDIRECT && hasRole("USERCENTRAL"))
//     ) {
//       return NextResponse.next();
//     }

//     // Redirecionar após login com base no papel
//     if (isAuthRoute || isPublicRoute) {
//       // Verificações individuais de cada papel
//       if (hasRole("USERLIDER")) {
//         return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_CELULA);
//       } else if (hasRole("USERSUPERVISOR")) {
//         return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_SUPERVISOR);
//       } else if (hasRole("USERCENTRAL")) {
//         return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT);
//       } else {
//         return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT);
//       }
//     }
//   }
//   return NextResponse.next();
// }

// export default async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const session = await auth();

//   const isLoggedIn = !!session;
//   const roleUser = session?.user?.role;

//   const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
//   const isPublicRoute = matchRoute(pathname, publicRoutes);
//   const isAuthRoute = matchRoute(pathname, authRoutes);

//   if (isApiAuthRoute) {
//     return NextResponse.next();
//   }

//   if (!isLoggedIn && !isPublicRoute) {
//     return NextResponse.redirect(new URL("/login", req.nextUrl));
//   }

//   if (isLoggedIn) {
//     if (!roleUser) {
//       return NextResponse.next();
//     }

//     // Verificar as rotas privadas e os papéis
//     const isPrivateRouteCentral = privateRoutesCentral.includes(pathname);
//     const isPrivateRouteCelula = privateRoutesCelula.includes(pathname);
//     const isPrivateRouteSupervisor = privateRoutesSupervisor.includes(pathname);

//     if (
//       isPrivateRouteCentral &&
//       roleUser !== "USERCENTRAL" &&
//       roleUser !== "USERLIDER"
//     ) {
//       return NextResponse.redirect(
//         new URL(DEFAULT_LOGIN_REDIRECT_SUPERVISOR, req.nextUrl),
//       );
//     }
//     if (
//       isPrivateRouteCentral &&
//       roleUser !== "USERCENTRAL" &&
//       roleUser !== "USERSUPERVISOR"
//     ) {
//       return NextResponse.redirect(
//         new URL(DEFAULT_LOGIN_REDIRECT_CELULA, req.nextUrl),
//       );
//     }
//     if (
//       isPrivateRouteCelula &&
//       roleUser !== "USERLIDER" &&
//       roleUser !== "USERCENTRAL"
//     ) {
//       return NextResponse.redirect(
//         new URL(DEFAULT_LOGIN_REDIRECT_SUPERVISOR, req.nextUrl),
//       );
//     }
//     if (
//       isPrivateRouteCelula &&
//       roleUser.includes("USERLIDER") &&
//       roleUser.includes("USERSUPERVISOR")
//     ) {
//       return NextResponse.redirect(
//         new URL(DEFAULT_LOGIN_REDIRECT_SUPERVISOR_LIDER, req.nextUrl),
//       );
//     }
//     if (
//       isPrivateRouteCelula &&
//       roleUser !== "USERLIDER" &&
//       roleUser !== "USERSUPERVISOR"
//     ) {
//       return NextResponse.redirect(
//         new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl),
//       );
//     }
//     if (
//       isPrivateRouteSupervisor &&
//       roleUser !== "USERSUPERVISOR" &&
//       roleUser !== "USERCENTRAL"
//     ) {
//       return NextResponse.redirect(
//         new URL(DEFAULT_LOGIN_REDIRECT_CELULA, req.nextUrl),
//       );
//     }
//     if (
//       isPrivateRouteSupervisor &&
//       roleUser !== "USERSUPERVISOR" &&
//       roleUser !== "USERLIDER"
//     ) {
//       return NextResponse.redirect(
//         new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl),
//       );
//     }

//     // Evitar redirecionamentos infinitos
//     if (
//       (pathname === DEFAULT_LOGIN_REDIRECT_CELULA &&
//         roleUser === "USERLIDER") ||
//       (pathname === DEFAULT_LOGIN_REDIRECT_SUPERVISOR &&
//         roleUser === "USERSUPERVISOR") ||
//       (pathname === DEFAULT_LOGIN_REDIRECT && roleUser === "USERCENTRAL")
//     ) {
//       return NextResponse.next();
//     }

//     // Redirecionar após login com base no papel
//     if (isAuthRoute || isPublicRoute) {
//       // Verificar se o usuário tem os dois papéis: "USERSUPERVISOR" e "USERLIDER"
//       if (roleUser.includes("USERLIDER") && roleUser.includes("USERSUPERVISOR")) {
//         return NextResponse.redirect(
//           new URL(DEFAULT_LOGIN_REDIRECT_SUPERVISOR_LIDER, req.nextUrl)
//         );
//       }

//       // Verificações individuais de cada papel
//       if (roleUser.includes("USERLIDER")) {
//         return NextResponse.redirect(
//           new URL(DEFAULT_LOGIN_REDIRECT_CELULA, req.nextUrl)
//         );
//       } else if (roleUser.includes("USERSUPERVISOR")) {
//         return NextResponse.redirect(
//           new URL(DEFAULT_LOGIN_REDIRECT_SUPERVISOR, req.nextUrl)
//         );
//       } else if (roleUser.includes("USERCENTRAL")) {
//         return NextResponse.redirect(
//           new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl)
//         );
//       } else {
//         return NextResponse.redirect(
//           new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl)
//         );
//       }
//     }

//   }

//   return NextResponse.next();
// }

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
