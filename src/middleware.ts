import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  privateRoutes,
  privateRoutesCentral,
  privateRoutesCelula,
  privateRoutesSupervisor,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_LOGIN_REDIRECT_CELULA,
  DEFAULT_LOGIN_REDIRECT_SUPERVISOR,
} from "@/routes";
import { auth } from "./auth";

function matchRoute(url: string, routes: string[]): boolean {
  return routes.some((route) => {
    const regex = new RegExp(
      `^${route
        .replace(/\?.*$/, "")
        .replace(/:[^\s/]+/g, "([\\w-]+)")}(\\?.*)?$`,
    );
    return regex.test(url);
  });
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  const isLoggedIn = !!session;
  const roleUser = session?.user.role;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = matchRoute(pathname, publicRoutes);
  const isAuthRoute = matchRoute(pathname, authRoutes);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoggedIn) {
    if (!roleUser) {
      return NextResponse.next();
    }

    // Verificar as rotas privadas e os papéis
    const isPrivateRouteCentral = privateRoutesCentral.includes(pathname);
    const isPrivateRouteCelula = privateRoutesCelula.includes(pathname);
    const isPrivateRouteSupervisor = privateRoutesSupervisor.includes(pathname);

    if (
      isPrivateRouteCentral &&
      roleUser !== "USERCENTRAL" &&
      roleUser !== "USERLIDER"
    ) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT_SUPERVISOR, req.nextUrl),
      );
    }
    if (
      isPrivateRouteCentral &&
      roleUser !== "USERCENTRAL" &&
      roleUser !== "USERSUPERVISOR"
    ) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT_CELULA, req.nextUrl),
      );
    }
    if (
      isPrivateRouteCelula &&
      roleUser !== "USERLIDER" &&
      roleUser !== "USERCENTRAL"
    ) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT_SUPERVISOR, req.nextUrl),
      );
    }
    if (
      isPrivateRouteCelula &&
      roleUser !== "USERLIDER" &&
      roleUser !== "USERSUPERVISOR"
    ) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl),
      );
    }
    if (
      isPrivateRouteSupervisor &&
      roleUser !== "USERSUPERVISOR" &&
      roleUser !== "USERCENTRAL"
    ) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT_CELULA, req.nextUrl),
      );
    }
    if (
      isPrivateRouteSupervisor &&
      roleUser !== "USERSUPERVISOR" &&
      roleUser !== "USERLIDER"
    ) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl),
      );
    }

    // Evitar redirecionamentos infinitos
    if (
      (pathname === DEFAULT_LOGIN_REDIRECT_CELULA &&
        roleUser === "USERLIDER") ||
      (pathname === DEFAULT_LOGIN_REDIRECT_SUPERVISOR &&
        roleUser === "USERSUPERVISOR") ||
      (pathname === DEFAULT_LOGIN_REDIRECT && roleUser === "USERCENTRAL")
    ) {
      return NextResponse.next();
    }

    // Redirecionar após login com base no papel
    if (isAuthRoute || isPublicRoute) {
      switch (roleUser) {
        case "USERLIDER":
          return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT_CELULA, req.nextUrl),
          );
        case "USERSUPERVISOR":
          return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT_SUPERVISOR, req.nextUrl),
          );
        case "USERCENTRAL":
          return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl),
          );
        default:
          return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl),
          );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
