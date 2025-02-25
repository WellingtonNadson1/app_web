import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_LOGIN_REDIRECT_CELULA,
  DEFAULT_LOGIN_REDIRECT_SUPERVISOR,
  privateRoutesCelula,
  privateRoutesCentral,
  privateRoutesSupervisor,
  privateRoutesSupervisorLider,
  publicRoutes,
} from '@/routes';
import type { MiddlewareConfig, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from './app/auth';

function matchRoute(url: string, routes: string[]): boolean {
  return routes.some((route) => {
    const regex = new RegExp(
      `^${route
        .replace(/\?.*$/, '')
        .replace(/:[^\s/]+/g, '([\\w-]+)')}(\\?.*)?$`,
    );
    return regex.test(url);
  });
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();
  const isLoggedIn = !!session;
  const roleUser = session?.user?.user_roles;
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = matchRoute(pathname, publicRoutes);
  const isAuthRoute = matchRoute(pathname, authRoutes);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isLoggedIn) {
    if (!roleUser || roleUser.length === 0) {
      return NextResponse.next();
    }

    // Função auxiliar para verificar se o array de roles contém um determinado nome
    const hasRole = (roleName: string) =>
      roleUser.some((role) => role.rolenew.name === roleName);

    // Função para redirecionar se a URL de destino for diferente da atual
    const redirectIfNeeded = (destinationUrl: string) => {
      const currentUrl = req.nextUrl.pathname;
      if (currentUrl !== destinationUrl) {
        return NextResponse.redirect(new URL(destinationUrl, req.nextUrl));
      }
      return NextResponse.next(); // Não redirecionar se já estiver na URL correta
    };

    // Verificar as rotas privadas e os papéis
    const isPrivateRouteCentral = privateRoutesCentral.includes(pathname);
    const isPrivateRouteCelula = privateRoutesCelula.includes(pathname);
    const isPrivateRouteSupervisor = privateRoutesSupervisor.includes(pathname);
    const isPrivateRouteSupervisorLider =
      privateRoutesSupervisorLider.includes(pathname);

    // Verificar se o usuário tem os dois papéis: "USERLIDER" e "USERSUPERVISOR"
    if (hasRole('USERLIDER') && hasRole('USERSUPERVISOR')) {
      // Rotas específicas para SupervisorLider
      if (isPrivateRouteSupervisorLider) {
        return NextResponse.next(); // Pode acessar rotas tanto de Supervisor quanto de Líder
      }
    }

    // Verificações de rotas privadas
    if (isPrivateRouteCentral && !hasRole('USERCENTRAL')) {
      return redirectIfNeeded(DEFAULT_LOGIN);
    }
    if (isPrivateRouteCelula && !hasRole('USERLIDER')) {
      return redirectIfNeeded(DEFAULT_LOGIN);
    }
    if (isPrivateRouteSupervisor && !hasRole('USERSUPERVISOR')) {
      return redirectIfNeeded(DEFAULT_LOGIN);
    }

    // Evitar redirecionamentos infinitos
    if (
      (pathname === DEFAULT_LOGIN_REDIRECT_CELULA && hasRole('USERLIDER')) ||
      (pathname === DEFAULT_LOGIN_REDIRECT_SUPERVISOR &&
        hasRole('USERSUPERVISOR')) ||
      (pathname === DEFAULT_LOGIN_REDIRECT && hasRole('USERCENTRAL'))
    ) {
      return NextResponse.next();
    }

    // Redirecionar após login com base no papel
    if (isAuthRoute || isPublicRoute) {
      // Verificações individuais de cada papel
      if (hasRole('USERLIDER')) {
        return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_CELULA);
      } else if (hasRole('USERSUPERVISOR')) {
        return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT_SUPERVISOR);
      } else if (hasRole('USERCENTRAL')) {
        return redirectIfNeeded(DEFAULT_LOGIN_REDIRECT);
      } else {
        return redirectIfNeeded(DEFAULT_LOGIN);
      }
    }
  }
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!_next|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
