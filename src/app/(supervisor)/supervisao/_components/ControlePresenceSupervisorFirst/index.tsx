'use client'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner, User } from '@phosphor-icons/react/dist/ssr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'
import {
  ControlePresencaSupervisorProps,
  attendance,
  attendanceSchema,
} from '../../schema'

function isError(error: unknown): error is Error {
  return error instanceof Error
}

export default function ControlePresenceSupervisorFirst({
  id,
  culto,
  supervisorId,
}: ControlePresencaSupervisorProps) {
  const URLControlePresenca = `${BASE_URL}/presencacultos`
  const URLPresencaCultoId = `${BASE_URL}/presencacultosbycelula/${culto}/${supervisorId}`
  // const { handleSubmit, register } = useForm<attendance>()
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth(session?.user?.token as string)
  const queryClient = useQueryClient()
  const [progress, setProgress] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const getPresenceRegistered = async () => {
    const { data } = await axiosAuth.get(URLPresencaCultoId)
    return data
  }

  const {
    data: PresenceExistRegisteredSupervisorFirst,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['presenceExistRegisteredSupervisorFirst'],
    queryFn: getPresenceRegistered,
    refetchOnMount: true,
  })

  const createPresencaCultoSupervisorFunction = async (data: attendance) => {
    try {
      const dataPresence = {
        ...data,
        status: data.status === 'true',
      }
      // CHECANDO SE O ID DO SUPERVISOR ESTÁ NA REQUISICAO
      if (!dataPresence.membro) {
        toast({
          variant: 'destructive',
          title: 'Ocorreu um Erro',
          description: 'Faltando dados para registro de Presença!',
        })
        throw new Error('Faltando dados para registro de Presença!')
      }
      const response = await axiosAuth.post(URLControlePresenca, dataPresence, {
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
      })
      const presenceRegister = response.data
      if (!presenceRegister) {
        toast({
          variant: 'destructive',
          title: 'Ocorreu um Erro',
          description: 'Erro no registro de Presença!',
        })
        throw new Error('Failed to submit dados de presenca')
      }
      toast({
        variant: 'default',
        title: 'Successo',
        description: '😉 Presença registrada com sucesso.',
      })
    } catch (error) {
      console.error('error: ', error)
    }
  }

  const {
    mutateAsync: createPresencaCultoSupervisorFn,
    isPending,
    isSuccess,
    data: createdPresence,
  } = useMutation({
    mutationFn: createPresencaCultoSupervisorFunction,
    onError: (err, newMember, context) => {
      queryClient.invalidateQueries({
        queryKey: ['presenceExistRegisteredSupervisorFirst'],
      })
      queryClient.invalidateQueries({ queryKey: ['meetingsData'] })
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['presenceExistRegisteredSupervisorFirst'],
      })
      queryClient.invalidateQueries({ queryKey: ['meetingsData'] })
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

  const form = useForm<attendance>({
    resolver: zodResolver(attendanceSchema),
  })

  useEffect(() => {
    form.setValue('presenca_culto', culto)
    form.setValue('membro', supervisorId)
  }, [culto, form])

  // Funcao para submeter os dados do Formulario Preenchido
  async function onSubmit(data: attendance) {
    setIsCompleted(false)
    try {
      await createPresencaCultoSupervisorFn(data)
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
          description: `${
            axiosError.response?.status === 409
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
          {PresenceExistRegisteredSupervisorFirst || isSuccess ? (
            <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
              Presença já cadastrada!
            </p>
          ) : (
            <>
              <Toaster />
              <div
                id={id}
                className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl"
              >
                <div className="w-full px-2 py-2 ">
                  <div className="w-full px-1 py-2 rounded-md">
                    <h2 className="mb-6 text-base font-medium leading-8 text-gray-800">
                      Presença de Culto
                    </h2>
                    {isPending && (
                      <div>
                        <p className="text-right mb-1.5 transition duration-150 ease-in">{`${progress.toFixed(
                          0,
                        )}%`}</p>
                        <Progress max={100} className="mb-3" value={progress} />
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
                            <>
                              <Separator
                                key={session?.user?.id}
                                className=" bg-gray-200 w-full"
                              />

                              <div
                                className="grid sm:grid-cols-6 grid-cols-4 items-center justify-between"
                                key={session?.user?.first_name}
                              >
                                <div className="col-span-2 w-full grid grid-cols-2 gap-2 items-center justify-between">
                                  {/* Nome */}
                                  <div className="sm:grid col-span-2">
                                    <div className="flex items-center justify-start w-full gap-1 my-2 mr-2 sm:gap-1">
                                      <div className="hidden sm:block p-1 border rounded-full bg-slate-50 border-[#1F70B6]">
                                        <User size={20} />
                                      </div>
                                      <h2 className="sm:ml-2 truncate">
                                        {session?.user?.first_name}
                                      </h2>
                                    </div>
                                  </div>
                                </div>

                                {/* Status */}
                                <div className="sm:grid col-span-1 hidden w-full text-center">
                                  {session?.user.situacaoNoReinoId ===
                                  'f4c1c9ee-5f5a-4681-af13-99c422c240e0' ? (
                                    <Badge
                                      className={`text-zinc-800 hidden w-full rounded-md px-2 py-1 text-center sm:block ${'border border-green-200 bg-green-100 ring-green-500'} hover:border-green-300 hover:bg-green-200 hover:ring-green-600`}
                                    >
                                      {'Normal'}
                                    </Badge>
                                  ) : session?.user.situacaoNoReinoId ===
                                    '0892b1ed-3e99-4e13-acf6-99f7a0e99358' ? (
                                    <Badge
                                      className={`text-zinc-800 hidden w-full rounded-md px-2 py-1 text-center sm:block ${'border border-sky-200 bg-sky-100 ring-sky-500'}
                                          hover:border-sky-300 hover:bg-sky-200 hover:ring-sky-600`}
                                    >
                                      {'Ativo'}
                                    </Badge>
                                  ) : (
                                    <Badge
                                      className={`text-zinc-800 hidden w-full rounded-md px-2 py-1 text-center sm:block ${'border border-red-200 bg-red-100 ring-red-500'} hover:border-red-300 hover:bg-red-200 hover:ring-red-600`}
                                    >
                                      {'Frio'}
                                    </Badge>
                                  )}
                                </div>

                                {/* Cargo */}
                                <div className="hidden w-full text-center sm:grid col-span-1 mx-2">
                                  <Badge className="hidden w-full px-2 py-1 text-center border border-gray-200 rounded-md bg-gray-50 ring-gray-500 hover:border-gray-300 hover:bg-gray-200 hover:ring-gray-600 sm:block">
                                    {session?.user.cargoDeLiderancaId ===
                                    'c394f146-c054-4d77-97a8-d24ee4d9013c' ? (
                                      <span
                                        className="text-foreground"
                                        key={'ativo'}
                                      >
                                        Pastor
                                      </span>
                                    ) : session?.user.cargoDeLiderancaId ===
                                      '1777ff88-7b8a-4ac9-9926-9f6ac13872c6' ? (
                                      <span
                                        className="text-foreground"
                                        key={'nomral'}
                                      >
                                        Sup. de Área
                                      </span>
                                    ) : session?.user.cargoDeLiderancaId ===
                                      '4508f737-cdf5-405a-951b-db91c11f2555' ? (
                                      <span
                                        className="text-foreground"
                                        key={'frio'}
                                      >
                                        Sup. de Setor
                                      </span>
                                    ) : session?.user.cargoDeLiderancaId ===
                                      '6bc843b9-83f4-45c4-ad45-b77077c0ace2' ? (
                                      <span
                                        className="text-foreground"
                                        key={'frio'}
                                      >
                                        Líder de Célula
                                      </span>
                                    ) : session?.user.cargoDeLiderancaId ===
                                      '079e35a7-8e9c-40ef-9d5b-cb8f9c7c11a8' ? (
                                      <span
                                        className="text-foreground"
                                        key={'frio'}
                                      >
                                        Membro
                                      </span>
                                    ) : session?.user.cargoDeLiderancaId ===
                                      'ac44e636-6953-46c6-ab8e-7fcd0a36ddae' ? (
                                      <span
                                        className="text-foreground"
                                        key={'frio'}
                                      >
                                        Sup. de Distrito
                                      </span>
                                    ) : session?.user.cargoDeLiderancaId ===
                                      '78e0f4ef-9578-4a17-9d34-31617ca82018' ? (
                                      <span
                                        className="text-foreground"
                                        key={'frio'}
                                      >
                                        Líder Auxiliar
                                      </span>
                                    ) : (
                                      <span
                                        className="text-foreground"
                                        key={'frio'}
                                      >
                                        Líder de Célula Sup.
                                      </span>
                                    )}
                                  </Badge>
                                </div>

                                <FormField
                                  control={form.control}
                                  name={'status'}
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
            </>
          )}
        </>
      )}
    </>
  )
}
