'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { CalendarHeart } from '@phosphor-icons/react/dist/ssr'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowUpDown, Check, ChevronDown, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import DeleteEventoAgenda from '../DeleteEventoAgenda'
import UpdateAgendaIgreja from '../UpdateAgendaIgreja'
import { allAgendaReturnSchemaTable } from './schema'
import { useSession } from 'next-auth/react'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'

export const columns: ColumnDef<z.infer<typeof allAgendaReturnSchemaTable>>[] = [
  // Status
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const queryClient = useQueryClient()
      const URLApi = '/api/agenda-ibb-service/create-evento-agenda'

      const data = row.original
      const [open, setOpen] = useState(false)
      const [value, setValue] = useState(data.status)
      const statuses = [
        {
          value: true,
          label: 'Ativo',
        },
        {
          value: false,
          label: 'Pausado',
        },
      ]

      interface updateStatusProps {
        status: boolean
        idEventoAgenda: string
      }

      const updateStatusEventoAgendaFunction = async (
        values: updateStatusProps,
      ) => {
        console.log('values', values)
        const { data: session } = useSession()
        const token = session?.user?.token as string
        const axiosAuth = useAxiosAuth(token)
        const response = await axiosAuth.patch(
          URLApi,
          {
            id: values.idEventoAgenda,
            status: values.status,
          },
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        )
        return response.data
      }

      const { mutateAsync: updateStatusEventoAgendaCelulaFn } =
        useMutation({
          mutationFn: updateStatusEventoAgendaFunction,
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['eventosAgendaIbb'] })
          },
        })

      const handleSelectedStatus = async ({
        status,
        idEventoAgenda,
      }: updateStatusProps) => {
        console.log('status click: ', status)
        console.log('idEventoAgenda click: ', idEventoAgenda)

        const response = await updateStatusEventoAgendaCelulaFn({
          status,
          idEventoAgenda,
        })
        console.log('responseFolder: ', response)
        if (response) {
          toast({
            variant: 'default',
            title: 'Successo',
            description: 'Status do EVENTO Atualizado com Sucesso. 😇',
          })
        } else {
          toast({
            title: 'Erro!!!',
            description: 'Erro na Atualização do Status do EVENTO. 😰',
            variant: 'destructive',
          })
        }
      }

      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                'justify-between font-normal h-7 rounded-xl',
                value
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-orange-500 text-white hover:bg-orange-600',
              )}
            >
              {value ? 'Ativo' : 'Pausado'}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {open && (
            <PopoverContent className="w-[120px] p-0">
              <Command>
                <CommandGroup>
                  {/* quando quero apresentar uma lista se faz necessario add CommandList */}
                  <CommandList>
                    {statuses.map((status) => {
                      return (
                        <CommandItem
                          key={status.label}
                          onSelect={() => {
                            setValue(status.value)
                            handleSelectedStatus({
                              status: status.value,
                              idEventoAgenda: data.id,
                            })
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === status.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {status.label}
                        </CommandItem>
                      )
                    })}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      )
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
      )
    },
    cell: ({ row }) => {
      const data = row.original
      return (
        <div className="flex w-full items-center justify-start ">
          <div>
            <CalendarHeart weight="light" color="#555353" size={23} />
          </div>
          <p className="ml-3">{data.title}</p>
        </div>
      )
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
      )
    },
    cell: ({ row }) => {
      const data = row.original
      const dataInicio = dayjs(data.data_inicio).format('DD/MM/YYYY')
      return (
        <div className="flex w-full items-center justify-start ">
          {/* <div>
            <UserCircle weight="light" color="#555353" size={23} />
          </div> */}
          <p className="ml-3">{dataInicio}</p>
        </div>
      )
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
      )
    },
    cell: ({ row }) => {
      const data = row.original
      const dataTermino = dayjs(data.data_termino).format('DD/MM/YYYY')
      return (
        <div className="flex w-full items-center justify-start ">
          {/* <div>
            <UserCircle weight="light" color="#555353" size={23} />
          </div> */}
          <p className="ml-3">{dataTermino}</p>
        </div>
      )
    },
    filterFn: 'fuzzy',
  },
  // OPÇÕES
  {
    id: 'actions',
    cell: ({ row }) => {
      const evento = row.original
      const router = useRouter()
      const handleClickCelula = (event: React.MouseEvent<HTMLElement>) => {
        const idTemaLicaoCelula = event.currentTarget.id
        router.push(
          `/celulas/tema-licoes-celula/${idTemaLicaoCelula}/?id=${idTemaLicaoCelula}`,
        )
      }

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
      )
    },
  },
]
