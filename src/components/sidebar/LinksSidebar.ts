import {
  Baby,
  Calendar,
  ChartBar,
  HandHeart,
  Heart,
  Megaphone,
  Student,
  Target,
  Users,
  UsersFour,
} from '@phosphor-icons/react';

import { LayoutDashboard } from 'lucide-react';

export const sidebarCentral = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/central/dashboard' },
  { name: 'Cadastro Memb.', icon: Baby, href: '/central/novo-membro' },
  { name: 'Supervisões', icon: UsersFour, href: '/central/supervisoes' },
  { name: 'Células', icon: Users, href: '/central/celulas' },
  { name: 'Disicipulados', icon: HandHeart, href: '/central/discipulados' },
  { name: 'Escolas', icon: Student, href: '/central/escolas' },
  { name: 'Relatórios', icon: ChartBar, href: '/central/relatorios' },
  { name: 'Cultos', icon: Calendar, href: '/central/cultos' },
  { name: 'Agenda', icon: Megaphone, href: '/central/agenda-igreja' },
  // { name: 'Fincanceiro', icon: Wallet, href: '/financeiro' },
];

export const sidebarLiderCelula = [
  // { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Célula', icon: Users, href: '/celula' },
  {
    name: 'Discipulados',
    icon: HandHeart,
    href: '/celula/discipuladoscelularegister',
  },
];

export const sidebarSupervisor = [
  // { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Presença', icon: Target, href: '/supervisao' },
  {
    name: 'Discipulados',
    icon: HandHeart,
    href: '/supervisao/discipuladosregistersupervisor',
  },
];
export const sidebarSupervisorLider = [
  { name: 'Célula', icon: Users, href: '/celula' },
  {
    name: 'Disc. Célula',
    icon: HandHeart,
    href: '/celula/discipuladoscelularegister',
  },
  {
    name: 'Disc. Supervisor',
    icon: Heart,
    href: '/supervisao/discipuladosregistersupervisor',
  },
  // { name: 'Eventos', icon: Calendar, href: '/eventos' },
];
