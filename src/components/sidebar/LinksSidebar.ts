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
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Cadastro Memb.', icon: Baby, href: '/novo-membro' },
  { name: 'Supervisões', icon: UsersFour, href: '/supervisoes' },
  { name: 'Células', icon: Users, href: '/celulas' },
  { name: 'Disicipulados', icon: HandHeart, href: '/discipulados' },
  { name: 'Escolas', icon: Student, href: '/escolas' },
  { name: 'Relatórios', icon: ChartBar, href: '/relatorios' },
  { name: 'Cultos', icon: Calendar, href: '/cultos' },
  { name: 'Agenda', icon: Megaphone, href: '/agenda-igreja' },
];

export const sidebarLiderCelula = [
  { name: 'Célula', icon: Users, href: '/celula' },
  {
    name: 'Discipulados',
    icon: HandHeart,
    href: '/discipuladoscelularegister',
  },
];

export const sidebarSupervisor = [
  { name: 'Presença', icon: Target, href: '/supervisao' },
  {
    name: 'Discipulados',
    icon: HandHeart,
    href: '/discipuladosregistersupervisor',
  },
];
export const sidebarSupervisorLider = [
  { name: 'Célula', icon: Users, href: '/celula' },
  {
    name: 'Disc. Célula',
    icon: HandHeart,
    href: '/discipuladoscelularegister',
  },
  {
    name: 'Disc. Supervisor',
    icon: Heart,
    href: '/discipuladosregistersupervisor',
  },
];
