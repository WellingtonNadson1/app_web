'use client'
import { ComboboxDemo } from '@/components/MultiUserSelect/multi-membros-select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useCombinedStore } from '@/store/DataCombineted'
import { PencilSimple, Spinner } from '@phosphor-icons/react/dist/ssr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'
import { z } from 'zod'
import { dataUpdateDiscipulador2, schemaDataUpdateDiscipulador2, UpdateSupervisorProps2 } from './schema'
import { BASE_URL } from '@/lib/axios'
import { useSession } from 'next-auth/react'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'

dayjs.extend(utc)
dayjs.extend(timezone)

interface User {
  id: string;
  situacao_no_reino: {
    id: string;
    nome: string;
  };
  cargo_de_lideranca: {
    id: string;
    nome: string;
  };
  first_name?: string | undefined;
}

export default function UpdateSupervisorDisicipulado2(props: UpdateSupervisorProps2) {
  const { data: session } = useSession()
  const token = session?.user?.token as string
  const axiosAuth = useAxiosAuth(token)
  const URLUsers = `${BASE_URL}/users/alldiscipulados`
  const URLUpdateDiscipulador = `${BASE_URL}/users/discipulad`

  const { supervisorId } = useParams()
  const { state } = useCombinedStore()
  const supervisoes = state.supervisoes
  const currentSupervisao = supervisoes.filter((supervisao) => supervisao.id === supervisorId)
  const supervisor = currentSupervisao[0].supervisor

  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [queryUpDate, setQueryUpDate] = useState('')
  const [supervisorDiscipulador, setSupervisorDiscipulador] = useState(supervisor)

  const form = useForm<dataUpdateDiscipulador2>()

  const CreateNewRelationDiscipuladoFunction = async (
    data: z.infer<typeof schemaDataUpdateDiscipulador2>,
  ) => {

    const response = await axiosAuth.put(URLUpdateDiscipulador, {
      ...data,
    })
    form.reset()
    return response.data
  }

  const { mutateAsync: createNewRelationDiscipuladoFn, isPending } = useMutation({
    mutationFn: CreateNewRelationDiscipuladoFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['allCelulasIbb'] })
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof schemaDataUpdateDiscipulador2>> = async (
    data,
  ) => {
    const newData = {
      id: props.member.user_discipulos.id,
      //@ts-ignore
      discipuladorId: data.discipuladorId[0].id
    }
    console.log('Valor selecionado:', newData);
    const response = await createNewRelationDiscipuladoFn(data)
    if (response) {
      toast({
        variant: 'default',
        title: 'Successo',
        description: 'Discipulado ATUALIZADO com sucesso.',
      })
      form.reset()
    } else {
      toast({
        title: 'Erro!!!',
        description: 'Erro na ATUALIZAÇÃO do Discipulado. 😰',
        variant: 'destructive',
      })
    }
  }

  const AllMembers = async () => {
    try {
      const { data } = await axiosAuth.get(URLUsers)
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const { data: queryMembers, isLoading: isLoadingQueryUpdate } = useQuery<
    User[]
  >({
    queryKey: ['membersquery'],
    queryFn: AllMembers,
    retry: 3,
  })

  if (!queryMembers) {
    return
  }

  const queryMembersSort = queryMembers?.sort((a, b) =>
    (a.first_name ?? '').localeCompare(b.first_name ?? ''),
  )

  const filteredPeople =
    queryUpDate === ''
      ? queryMembersSort
      : queryMembersSort?.filter((person) =>
        (person.first_name ?? '')
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(queryUpDate.toLowerCase().replace(/\s+/g, '')),
      )

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DropdownMenuItem className="w-full flex items-center justify-between gap-2 px-2 hover:bg-transparent hover:text-foreground">
                Editar Discipulado
                <PencilSimple size={18} />
              </DropdownMenuItem>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </DialogTrigger>
        <DialogContent className="lg:max-w-screen-md overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Atualizar Discipulado</DialogTitle>
            <DialogDescription>
              Edite os dados preenchendo o formulário
            </DialogDescription>
          </DialogHeader>

          {/* Incio do Forms */}
          <div className="relative w-full mx-auto ">
            <div className="flex justify-between">
              <div className="relative mx-auto py-4">
                <div className="p-2 mx-auto bg-white rounded-lg">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="pb-3">
                        {/* Nome da Celula */}
                        <div className="grid grid-cols-1 mt-4 gap-x-4 gap-y-6 sm:grid-cols-8">
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="id"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Discípulo</FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled
                                      placeholder={props?.member?.user_discipulos?.first_name}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {/* Lider */}
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="id"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Discipulador Atual</FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled
                                      placeholder={supervisorDiscipulador.first_name}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {/* Selecao de Membros */}
                          <div className="sm:col-span-8">
                            <FormField
                              control={form.control}
                              name="discipuladorId"
                              render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2">
                                  <FormLabel>Novo Discipulador</FormLabel>
                                  <ComboboxDemo
                                    items={filteredPeople}
                                    selectedItems={Array.isArray(field.value) ? field.value : []}
                                    setSelectedItems={(val) =>
                                      field.onChange(val)
                                    } // Atualiza o valor selecionado
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="sm:col-span-8 my-3">
                            <Separator />
                          </div>
                        </div>
                        {/* Botões para submeter Forms */}
                        <div className="flex items-center w-full sm:justify-end mt-6 gap-x-6">
                          <Button
                            type="submit"
                            className="px-3 py-2 text-sm w-full font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                          >
                            {isPending ? (
                              <div className="flex justify-between items-center gap-2">
                                Salvando
                                <Spinner />
                              </div>
                            ) : (
                              <span>Salvar</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
