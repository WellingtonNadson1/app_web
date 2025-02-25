/**
 * @type {string[]}
 */

export const publicRoutes: string[] = [
  '/',
  '/login',
  '/auth/new-verification',
  '/portfolio',
  '/services',
  '/contato',
  '/register',
  '/vistoriador',
];

/**
 * @type {string[]}
 */
export const privateRoutesCentral: string[] = [
  '/dashboard',
  '/celulas/:path*',
  '/cultos/:path*',
  '/disicipulados/:path*',
  '/escolas/:path*',
  '/financeiro/:path*',
  '/novo-membro/:path*',
  '/relatorio-culto-supervisao/:path*',
  '/relatorio-culto-supervisor/:path*',
  '/relatorio-discipulados-supervisao/:path*',
  '/relatorio-discipulados-supervisor/:path*',
  '/relatorio-presenca-celula-supervisao/:path*',
  '/relatorios/:path*',
  '/supervisoes/:path*',
];

export const privateRoutesCelula: string[] = [
  '/celula/:path*',
  '/discipuladoscelularegister/:path*',
];

export const privateRoutesSupervisor: string[] = [
  '/discipuladosregistersupervisor/:path*',
];

export const privateRoutesSupervisorLider: string[] = [
  '/discipuladoscelularegister/:path*',
  '/discipuladosregistersupervisor/:path*',
];

/**
 * @type {string[]}
 */
export const privateRoutes: string[] = ['/notification', '/auth'];

/**
 * @type {string[]}
 */
export const authRoutes: string[] = ['/login', '/auth/new-verification', '/'];

/**
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * @type {string}
 */
export const DEFAULT_LOGIN: string = '/login';
export const DEFAULT_LOGIN_REDIRECT: string = '/dashboard';
export const DEFAULT_LOGIN_REDIRECT_CELULA: string = '/celula';
export const DEFAULT_LOGIN_REDIRECT_SUPERVISOR: string = '/supervisao';
export const DEFAULT_LOGIN_REDIRECT_SUPERVISOR_LIDER: string = '/celula';
