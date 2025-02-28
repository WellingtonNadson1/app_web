'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircle } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { z } from 'zod';
import DeleteMember from '../DeleteMember';
import UpdateMember from '../UpdateMember';
import { userSchemaTable } from './schema';
import StatusMembro from './StatusMembro';

export const columns: ColumnDef<z.infer<typeof userSchemaTable>>[] = [
  // NOME MEMBRO
  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      row.getValue('first_name');
      const { first_name } = row.original;
      return (
        <div className="flex w-full items-center justify-start ">
          <div>
            <UserCircle weight="light" color="#555353" size={23} />
          </div>
          <p className="ml-3">{first_name}</p>
        </div>
      );
    },
  },
  // STATUS
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <StatusMembro
          statusMembro={data.situacao_no_reino}
          idMembro={data.id}
        />
      );
    },
    filterFn: 'includesString',
  },
  // CARGO
  {
    accessorKey: 'cargo_de_lideranca.nome',
    header: ({ column }) => {
      return (
        <Button
          className="sm:flex items-center justify-between hidden"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cargo
          <ArrowUpDown className="hidden sm:table-cell ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      row.getValue('cargo_de_lideranca.nome');
      const { cargo_de_lideranca } = row.original;
      return (
        <Badge className="w-full py-1 items-center hidden sm:table-cell text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">
          {cargo_de_lideranca?.nome}
        </Badge>
      );
    },
    filterFn: 'includesString',
  },
  // SUPERVISÃO
  {
    accessorKey: 'supervisao_pertence.nome',
    header: () => <div className="hidden sm:block">Supervisão</div>,
    cell: ({ row }) => {
      row.getValue('supervisao_pertence.nome');
      const { supervisao_pertence } = row.original;
      return (
        <Badge className="w-full py-1 items-center hidden sm:table-cell text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">
          {supervisao_pertence?.nome}
        </Badge>
      );
    },
    filterFn: 'includesString',
  },
  // CÉLULA
  {
    accessorKey: 'celula.nome',
    header: () => <div className="hidden sm:block">Célula</div>,
    cell: ({ row }) => {
      row.getValue('celula.nome');
      const { celula } = row.original;
      return (
        <Badge className="w-full py-1 items-center hidden sm:table-cell text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">
          {celula?.nome}
        </Badge>
      );
    },
    filterFn: 'includesString',
  },
  // OPÇÕES
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <UpdateMember member={user} />

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <DeleteMember memberId={user.id} memberName={user.first_name} />
              {/* <Link href={`/pdf/${user.id}`}>Deletar</Link> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
