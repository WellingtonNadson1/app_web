import {
  Baby,
  Calendar,
  ChartBar,
  Student,
  Users,
  UsersFour,
} from '@phosphor-icons/react'

import { LayoutDashboard } from 'lucide-react'

export const sidebarCentral = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Novo Memb.', icon: Baby, href: '/novo-membro' },
  { name: 'Supervisões', icon: UsersFour, href: '/supervisoes' },
  { name: 'Células', icon: Users, href: '/celulas' },
  { name: 'Escolas', icon: Student, href: '/escolas' },
  { name: 'Relatórios', icon: ChartBar, href: '/relatorios' },
  { name: 'Eventos', icon: Calendar, href: '/eventos' },
  // { name: 'Fincanceiro', icon: Wallet, href: '/financeiro' },
]

export const sidebarLiderCelula = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Células', icon: Users, href: '/celulas' },
  { name: 'Eventos', icon: Calendar, href: '/eventos' },
]