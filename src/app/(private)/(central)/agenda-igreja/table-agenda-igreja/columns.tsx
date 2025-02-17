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
import { CalendarHeart } from '@phosphor-icons/react/dist/ssr';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import DeleteEventoAgenda from '../DeleteEventoAgenda';
import UpdateAgendaIgreja from '../UpdateAgendaIgreja';
import { allAgendaReturnSchemaTable } from './schema';
import StatusCell from './StatusCell';

export const columns: ColumnDef<z.infer<typeof allAgendaReturnSchemaTable>>[] =
  [
    // Status
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
        return <StatusCell status={data.status} idEventoAgenda={data.id} />;
      },
      filterFn: 'includesString',
    },
    // NOME EVENTO
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Evento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex w-full items-center justify-start ">
            <div>
              <CalendarHeart weight="light" color="#555353" size={23} />
            </div>
            <p className="ml-3">{data.title}</p>
          </div>
        );
      },
      filterFn: 'includesString',
    },
    // Data Inicial
    {
      accessorKey: 'data_inicio',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data Iníc.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        const dataInicio = dayjs(data.data_inicio).format('DD/MM/YYYY');
        return (
          <div className="flex w-full items-center justify-start ">
            {/* <div>
            <UserCircle weight="light" color="#555353" size={23} />
          </div> */}
            <p className="ml-3">{dataInicio}</p>
          </div>
        );
      },
      filterFn: 'fuzzy',
    },
    // Data Final
    {
      accessorKey: 'data_termino',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data Fim
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        const dataTermino = dayjs(data.data_termino).format('DD/MM/YYYY');
        return (
          <div className="flex w-full items-center justify-start ">
            {/* <div>
            <UserCircle weight="light" color="#555353" size={23} />
          </div> */}
            <p className="ml-3">{dataTermino}</p>
          </div>
        );
      },
      filterFn: 'fuzzy',
    },
    // OPÇÕES
    {
      id: 'actions',
      cell: ({ row }) => {
        const evento = row.original;
        const router = useRouter();
        const handleClickCelula = (event: React.MouseEvent<HTMLElement>) => {
          const idTemaLicaoCelula = event.currentTarget.id;
          router.push(
            `/celulas/tema-licoes-celula/${idTemaLicaoCelula}/?id=${idTemaLicaoCelula}`,
          );
        };

        return (
          <>
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
                {/* UPDATE CELULA */}
                <DropdownMenuItem asChild>
                  <UpdateAgendaIgreja agendaData={evento} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* DELETAR CELULA */}
                <DropdownMenuItem asChild>
                  <DeleteEventoAgenda
                    eventoAgendaId={evento.id}
                    NomeEvento={evento.title}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
