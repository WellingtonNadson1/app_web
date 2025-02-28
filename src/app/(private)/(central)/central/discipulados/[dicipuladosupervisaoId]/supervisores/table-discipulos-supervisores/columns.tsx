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
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, UserCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { SupervisorSchema } from './schema';

export const columns: ColumnDef<z.infer<typeof SupervisorSchema>>[] = [
  // NOME DISCIPULADOR
  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      console.log('column supervisor', column);
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Discipulador
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      row.getValue('first_name');
      const supervisor = row.original;

      return (
        <div className="flex w-full items-center justify-start ">
          <div>
            <UserCircle color="#dbdbdd" size={23} />
          </div>
          <p className="ml-3">{supervisor?.first_name}</p>
        </div>
      );
    },
    filterFn: 'includesString',
  },
  // NOME CARGO LIDERANÇA
  {
    accessorKey: 'cargo_de_lideranca.nome',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cargo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      row.getValue('cargo_de_lideranca.nome');
      const supervisor = row.original;
      console.log('supervisor tabela', supervisor);

      return <Badge>{supervisor?.cargo_de_lideranca?.nome}</Badge>;
    },
    filterFn: 'includesString',
  },
  // OPÇÕES
  {
    id: 'actions',
    header: () => {
      return <Label>Opções</Label>;
    },
    cell: ({ row }) => {
      const supervisor = row.original;
      const router = useRouter();
      const { dicipuladosupervisaoId } = useParams();

      const handleClickDiscipuladoSUpervisor = (
        event: React.MouseEvent<HTMLElement>,
      ) => {
        const supervisorId = event.currentTarget.id;
        const URL = `/central/discipulados/${dicipuladosupervisaoId}/supervisor/${supervisorId}`;

        console.log('URL TEST:', URL);
        router.push(URL);
      };

      console.log('supervisor a ser passado', supervisor);

      return (
        <>
          <Toaster />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>

              <DropdownMenuSeparator />
              {/* ACESSAR DADOS DA CELULA */}
              <DropdownMenuItem asChild>
                <DropdownMenuItem
                  asChild
                  className="w-full flex items-center justify-between gap-2 px-2 hover:bg-transparent hover:text-foreground"
                >
                  <button
                    onClick={handleClickDiscipuladoSUpervisor}
                    id={supervisor?.id}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    Acessar
                    <MagnifyingGlass key={supervisor?.id} size={18} />
                  </button>
                </DropdownMenuItem>
              </DropdownMenuItem>
              {/* UPDATE CELULA */}
              <DropdownMenuItem asChild>
                {/* <UpdateSupervisorDisicipulado2 member={supervisor.discipulos} supervisor={supervisor} /> */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
