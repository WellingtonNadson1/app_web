/**
 * @type {string[]}
 */

export const publicRoutes: string[] = [
  '/login',
  '/auth/new-verification',
  '/portfolio',
  '/services',
  '/contato',
  '/register',
];

/**
 * @type {string[]}
 */
export const privateRoutesCentral: string[] = [
  '/central/dashboard',
  '/central/celulas',
  '/central/cultos',
  '/central/disicipulados',
  '/central/disicipulados/[dicipuladosupervisaoId]',
  '/central/disicipulados/[dicipuladosupervisaoId]/celulas',
  '/central/disicipulados/[dicipuladosupervisaoId]/celulas/[celulaId]',
  '/central/disicipulados/[dicipuladosupervisaoId]/supervisor',
  '/central/disicipulados/[dicipuladosupervisaoId]/supervisor/[supervisorId]',
  '/central/escolas',
  '/central/financeiro',
  '/central/novo-membro',
  '/central/relatorio-culto-supervisao/[id]',
  '/central/relatorio-culto-supervisor/[id]',
  '/central/relatorio-discipulados-supervisao',
  '/central/relatorio-discipulados-supervisor',
  '/central/relatorio-presenca-celula-supervisao/[id]',
  '/central/relatorios',
  '/central/relatorios/[id]',
  '/central/supervisoes',
  '/central/supervisoes/[supervisaoId]',
  '/central/supervisoes/[supervisaoId]/celulas',
  '/central/supervisoes/[supervisaoId]/celulas/[celulaId]',
];

export const privateRoutesCelula: string[] = [
  '/celula',
  '/celula/discipuladoscelularegister',
];

export const privateRoutesSupervisor: string[] = [
  '/supervisao',
  '/supervisao/discipuladosregistersupervisor',
];

export const privateRoutesSupervisorLider: string[] = [
  '/supervisao',
  '/celula/discipuladoscelularegister',
  '/supervisao/discipuladosregistersupervisor',
];

/**
 * @type {string[]}
 */
export const privateRoutes: string[] = ['/notification', '/auth'];

/**
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * @type {string}
 */
export const DEFAULT_LOGIN: string = '/login';
export const DEFAULT_LOGIN_REDIRECT_CENTRAL: string = '/central/dashboard';
export const DEFAULT_LOGIN_REDIRECT_CELULA: string = '/celula';
export const DEFAULT_LOGIN_REDIRECT_SUPERVISOR: string = '/supervisao';
export const DEFAULT_LOGIN_REDIRECT_SUPERVISOR_LIDER: string = '/celula';
