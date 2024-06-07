/**
 * @type {string[]}
 */

export const publicRoutes: string[] = ["/", "/auth/new-verification", "/portfolio", "/services", "/contato", "/register", "/vistoriador"];

/**
 * @type {string[]}
 */
export const privateRoutesCentral: string[] = [
  "/celulas",
  "/cultos",
  "/disicipulados",
  "/disicipulados/[dicipuladosupervisaoId]",
  "/disicipulados/[dicipuladosupervisaoId]/celulas",
  "/disicipulados/[dicipuladosupervisaoId]/celulas/[celulaId]",
  "/disicipulados/[dicipuladosupervisaoId]/supervisor",
  "/disicipulados/[dicipuladosupervisaoId]/supervisor/[supervisorId]",
  "/escolas",
  "/financeiro",
  "/novo-membro",
  "/relatorio-culto-supervisao/[id]",
  "/relatorio-culto-supervisor/[id]",
  "/relatorio-discipulados-supervisao",
  "/relatorio-discipulados-supervisor",
  "/relatorio-presenca-celula-supervisao/[id]",
  "/relatorios",
  "/relatorios/[id]",
  "/supervisoes",
  "/supervisoes/[supervisaoId]",
  "/supervisoes/[supervisaoId]/celulas",
  "/supervisoes/[supervisaoId]/celulas/[celulaId]",
];

export const privateRoutesCelula: string[] = [
  "/celula",
  "/discipuladoscelularegister",
];

export const privateRoutesSupervisor: string[] = [
  "/discipuladosregistersupervisor",
];

/**
 * @type {string[]}
 */
export const privateRoutes: string[] = [
  "/notification",
  "/auth"
  // "/vistoriador",
];

/**
 * @type {string[]}
 */
export const authRoutes: string[] = ["/login", "/auth/new-verification", "/"];

/**
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";
export const DEFAULT_LOGIN_REDIRECT_CELULA: string = "/celula";
export const DEFAULT_LOGIN_REDIRECT_SUPERVISOR: string = "/dashboard";
