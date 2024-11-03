'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Spinner, User } from '@phosphor-icons/react/dist/ssr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { ControlePresencaCelulaProps } from '../../schema'
import {
  FormSchema,
  dataForms,
} from '../ControlePresenceFirst/shcema-controle-first-presence'

function isError(error: unknown): error is Error {
  return error instanceof Error
}

const URLControlePresenca = `${BASE_URL}/presencacultos/speed`

export function RegisterPresenceFormSecond({
  id,
  culto,
  celula,
}: ControlePresencaCelulaProps) {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth(session?.user.token as string)
  const [progress, setProgress] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const getSecondPresenceRegistered = async () => {
    const URLPresencaCultoId = `${BASE_URL}/presencacultosbycelula/${culto}/${celula.lider.id}`

    const { data } = await axiosAuth.get(URLPresencaCultoId)
    return data
  }

  const {
    data: PresenceSecondExistRegistered,
    isLoading,
    isSuccess: isSuccessGetPresence,
    error,
  } = useQuery({
    queryKey: ['secondPresenceExistRegistered'],
    queryFn: getSecondPresenceRegistered,
    refetchOnMount: true,
  })

  const celulaSort = celula?.membros.sort((a, b) =>
    a.first_name.localeCompare(b.first_name),
  )
  const queryClient = useQueryClient()

  const createSecondPresencaCultoFunction = async ({
    presence_culto,
    membro,
  }: dataForms) => {
    // trnasformando o status de string para boolean
    const MembrosComStatus = membro.map((member) => ({
      ...member,
      status: member.status === 'true',
    }))

    const response = await axiosAuth.post(
      URLControlePresenca,
      {
        presence_culto,
        membro: MembrosComStatus,
      },
      {
        onUploadProgress: (progressEvent) => {
          // Introduz um atraso antes de atualizar o estado de progresso
          setTimeout(() => {
            setProgress(10)
          }, 600)

          setTimeout(() => {
            setProgress(30)
          }, 1200) // 150 + 150

          setTimeout(() => {
            setProgress(50)
          }, 1800) // 300 + 100

          setTimeout(() => {
            setProgress(70)
          }, 2400) // 400 + 100

          setTimeout(() => {
            setProgress(90)
          }, 3000) // 500 + 50
        },
      },
    )
    return response
  }

  const {
    mutateAsync: createSecondPresencaCultoFn,
    isPending,
    isSuccess: isSuccessSecond,
    data: createdPresence,
  } = useMutation({
    mutationFn: createSecondPresencaCultoFunction,
    mutationKey: ['NewPresenceRegisteredSecond'],
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ['NewPresenceRegisteredSecond'],
      })
    },
    onSuccess: () => {
      // Invalidando queries para refetch

      queryClient.invalidateQueries({
        queryKey: ['NewPresenceRegisteredSecond'],
      })
      toast({
        variant: 'default',
        title: 'Successo',
        description: 'Presença registrada com sucesso.',
      })
      setIsCompleted(true)
    },
  })

  useEffect(() => {
    if (!isPending && createdPresence) {
      setProgress(100)
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [progress])

  const form = useForm<dataForms>({
    resolver: zodResolver(FormSchema),
  })

  useEffect(() => {
    form.setValue('presence_culto', culto)
    celulaSort?.forEach((member, index) => {
      form.setValue(`membro.${index}.id`, member.id)
    })
  }, [celulaSort, culto, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsCompleted(false)
    try {
      await createSecondPresencaCultoFn(data)
      toast({
        variant: 'default',
        title: 'Successo',
        description: 'Presença registrada com sucesso.',
      })
    } catch (error) {
      const axiosError = error as AxiosError

      if (isError(axiosError)) {
        console.log(axiosError)
        toast({
          variant: 'destructive',
          title: 'Ocorreu um Erro',
          description: `${axiosError.response?.status === 409
              ? 'Presença de Culto já Registrada para hoje!'
              : axiosError.message
            }`,
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Ocorreu um Erro',
          description: `Um erro desconhecido ocorreu.`,
        })
      }
    }
  }
  return (
    <>
      {isLoading ? (
        <Spinner
          className="flex items-center justify-center animate-spin"
          size={20}
        />
      ) : isLoading ? (
        <Spinner
          className="flex items-center justify-center animate-spin"
          size={20}
        />
      ) : (
        <>
          {PresenceSecondExistRegistered || isSuccessSecond ? (
            <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
              Presença já cadastrada!
            </p>
          ) : (
            <>
              <Toaster />
              <div id={id}>
                <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
                  <div className="w-full px-2 py-2">
                    <div className="w-full px-1 py-2 rounded-md">
                      <h2 className="mb-4 text-base font-medium leading-8 text-zinc-700">
                        Presença de Culto
                      </h2>
                      {isPending && (
                        <div>
                          <p className="text-right mb-1.5 transition duration-150 ease-in">{`${progress.toFixed(
                            0,
                          )}%`}</p>
                          <Progress
                            max={100}
                            className="mb-3"
                            value={progress}
                          />
                        </div>
                      )}
                      <div className="w-full border-separate border-spacing-y-6">
                        <div className="grid sm:grid-cols-6 grid-cols-4 items-center justify-between">
                          <div className="sm:grid col-span-2 grid grid-cols-2 w-full py-2 text-gray-800 border-b-2 border-blue-300 text-start">
                            Nome
                          </div>
                          <div className="hidden w-full py-2 text-center text-gray-800 border-b-2 border-orange-300 sm:block">
                            Status
                          </div>
                          <div className="hidden w-full py-2 text-center text-gray-800 border-b-2 border-indigo-300 sm:block">
                            Cargo
                          </div>
                          <div className="sm:grid col-span-2 w-full grid grid-cols-2 items-center justify-around">
                            <div className="w-full px-2 py-2 text-center text-gray-800 border-b-2 border-green-300">
                              P
                            </div>
                            <div className="w-full px-2 py-2 text-center text-gray-800 border-b-2 border-red-300">
                              F
                            </div>
                          </div>
                        </div>

                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                          >
                            <div
                              key={id + 1}
                              className="grid grid-cols-1 items-center justify-between text-sm font-normal text-gray-700"
                            >
                              {celulaSort?.map((member, index) => (
                                <>
                                  <Separator
                                    key={member.id + index}
                                    className=" bg-gray-200 w-full"
                                  />

                                  <div
                                    className="grid sm:grid-cols-6 grid-cols-4 items-center justify-between"
                                    key={member.id}
                                  >
                                    <div className="col-span-2 w-full grid grid-cols-2 gap-2 items-center justify-between">
                                      {/* Nome */}
                                      <div className="sm:grid col-span-2">
                                        <div className="flex items-center justify-start w-full gap-1 my-2 mr-2 sm:gap-1">
                                          <div className="hidden sm:block p-1 border rounded-full bg-slate-50 border-[#1F70B6]">
                                            <User size={20} />
                                          </div>
                                          <h2 className="sm:ml-2 truncate">
                                            {member.first_name}
                                          </h2>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Status */}
                                    <div className="sm:grid col-span-1 hidden w-full text-center">
                                      {member?.situacao_no_reino?.nome ===
                                        'Normal' ? (
                                        <Badge
                                          className={`text-zinc-800 hidden w-full rounded-md px-2 py-1 text-center sm:block ${'border border-green-200 bg-green-100 ring-green-500'} hover:border-green-300 hover:bg-green-200 hover:ring-green-600`}
                                        >
                                          {member?.situacao_no_reino?.nome}
                                        </Badge>
                                      ) : member?.situacao_no_reino?.nome ===
                                        'Ativo' ? (
                                        <Badge
                                          className={`text-zinc-800 hidden w-full rounded-md px-2 py-1 text-center sm:block ${'border border-sky-200 bg-sky-100 ring-sky-500'} hover:border-sky-300 hover:bg-sky-200 hover:ring-sky-600`}
                                        >
                                          {member?.situacao_no_reino?.nome}
                                        </Badge>
                                      ) : (
                                        <Badge
                                          className={`text-zinc-800 hidden w-full rounded-md px-2 py-1 text-center sm:block ${'border border-green-200 bg-green-100 ring-green-500'}`}
                                        >
                                          {member?.situacao_no_reino?.nome}
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Cargo */}
                                    <div className="hidden w-full text-center sm:grid col-span-1 mx-2">
                                      <span className="w-full px-2 py-1 text-center text-foreground border border-gray-200 rounded-md bg-gray-50 ring-gray-500 sm:inline hover:border-gray-300 hover:bg-gray-200 hover:ring-gray-600">
                                        {member?.cargo_de_lideranca?.nome}
                                      </span>
                                    </div>

                                    <FormField
                                      control={form.control}
                                      name={`membro.${index}.status`}
                                      render={({ field }) => (
                                        <FormItem className="col-span-2 w-full grid grid-cols-2 items-center justify-around gap-3 space-y-3">
                                          <FormControl>
                                            <RadioGroup
                                              disabled={isPending}
                                              onValueChange={field.onChange}
                                              defaultValue={field.value}
                                              className="col-span-2 w-full grid grid-cols-2 items-center justify-around gap-3"
                                            >
                                              <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                  <RadioGroupItem
                                                    className={`col-span-1 sm:w-5 sm:h-5 w-4 h-4 mx-auto text-green-800 text-base border-green-400 cursor-pointer aria-checked:bg-green-100 aria-checked:ring-2 aria-checked:ring-green-400/[.55]`}
                                                    value="true"
                                                  />
                                                </FormControl>
                                              </FormItem>
                                              <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                  <RadioGroupItem
                                                    className={`col-span-1 sm:w-5 sm:h-5 w-4 h-4 mx-auto text-black text-base border-red-400 cursor-pointer aria-checked:bg-red-100 aria-checked:ring-2 aria-checked:ring-red-400/[.55]`}
                                                    value="false"
                                                  />
                                                </FormControl>
                                              </FormItem>
                                            </RadioGroup>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </>
                              ))}
                              <Button
                                className="w-full flex items-center justify-center gap-2 mt-3 bg-btnIbb hover:bg-btnIbb hover:opacity-90 transition duration-150 ease-out hover:ease-in"
                                disabled={isPending}
                                type="submit"
                              >
                                {isPending ? (
                                  <Spinner size={20} className="animate-spin" />
                                ) : (
                                  ''
                                )}
                                {isPending ? 'Registrando' : 'Registrar'}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
