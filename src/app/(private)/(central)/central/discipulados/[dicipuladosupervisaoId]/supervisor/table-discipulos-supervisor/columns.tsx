'use client';

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
import { useSupervisaoContext } from '@/contexts/supervisao/supervisao';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { SupervisorSchema } from '../../supervisores/table-discipulos-supervisores/schema';
import UpdateDiscipuladoSupervisor2 from '../[supervisorId]/UpdateDiscipuladoSupervisor2';

export const columns: ColumnDef<z.infer<typeof SupervisorSchema>>[] = [
  // NOME CELULA
  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      console.log('column', column);
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Discípulo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      row.getValue('first_name');
      const discipulo = row.original;
      console.log('discipulo tabela', discipulo);

      return (
        <div className="flex w-full items-center justify-start ">
          <div>
            <UserCircle color="#dbdbdd" size={23} />
          </div>
          <p className="ml-3">{discipulo?.first_name}</p>
        </div>
      );
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
      const discipuloOrignal = row.original;
      const router = useRouter();
      const contextParamsSupervisaoId = 'idsupervisao';
      const handleClickCelula = (event: React.MouseEvent<HTMLElement>) => {
        const idCelula = event.currentTarget.id;
        router.push(
          `/central/supervisoes/${contextParamsSupervisaoId}/celulas/${idCelula}`,
        );
      };

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
              {/* <DropdownMenuItem asChild>
                <DropdownMenuItem
                  asChild
                  className="w-full flex items-center justify-between gap-2 px-2 hover:bg-transparent hover:text-foreground"
                >
                  <button
                    onClick={handleClickCelula}
                    id={discipulo?.user_discipulos?.id}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    Acessar
                    <MagnifyingGlass key={discipulo?.user_discipulos?.id} size={18} />
                  </button>
                </DropdownMenuItem>
              </DropdownMenuItem> */}
              {/* UPDATE CELULA */}
              <DropdownMenuItem asChild>
                <UpdateDiscipuladoSupervisor2
                  discipulo={discipuloOrignal}
                  supervisor={discipuloOrignal}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
