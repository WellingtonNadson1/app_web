'use client'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { BASE_URL, success } from '@/functions/functions'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { UserFocus } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as z from 'zod'

const ReuniaoCelulaSchema = z.object({
  id: z.string(),
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_reuniao_celula: z.object({}).array(),
})

const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  situacao_no_reino: z.object({
    nome: z.string(),
  }),
  cargo_de_lideranca: z.object({
    nome: z.string(),
  }),
})

const CelulaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  lider: z.object({
    first_name: z.string(),
    id: z.string(),
  }),
  supervisao: z.string(),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  bairro: z.string(),
  endereco: z.string(),
  numero_casa: z.string(),
  date_inicio: z.string().datetime(),
  date_que_ocorre: z.string().datetime(),
  date_multipicar: z.string().datetime(),
  supervisaoId: z.string(),
  membros: z.array(UserSchema),
  reunioes_celula: z.array(ReuniaoCelulaSchema),
  userId: z.string(),
})

const PresencaCultoCelulaSchema = z.object({
  id: z.string(),
  status: z.boolean(),
  membro: z.string(),
  presenca_culto: z.string(),
})

const ControlePresencaSupervisorPropsSchema = z.object({
  supervisorId: z.string(),
  culto: z.string()
})

const attendanceSchema = z.object({
  status: z.string(),
  membro: z.string(),
  presenca_culto: z.string(),
})

export type PresencaCultoProps = z.infer<typeof PresencaCultoCelulaSchema>
export type ControlePresencaSupervisorProps = z.infer<typeof ControlePresencaSupervisorPropsSchema>
type attendance = z.infer<typeof attendanceSchema>

export default function ControlePresencaSupervisor({
  culto,
  supervisorId,
}: ControlePresencaSupervisorProps) {
  const URLControlePresenca = `${BASE_URL}/presencacultos`
  const URLPresencaCultoId = `${BASE_URL}/presencacultosbycelula/${culto}/${supervisorId}`
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const router = useRouter()
  const { handleSubmit, register, reset, formState: { errors } } = useForm<attendance>()
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth(session?.user.token as string)

  const getPresenceRegistered = async () => {
    const response = await axiosAuth.get(URLPresencaCultoId)
    const PresenceExistRegistered = await response.data
    return PresenceExistRegistered
  }

  const result = useQuery({
    queryKey: ['presence'],
    queryFn: getPresenceRegistered,
    retry: false
  })

  const { data:PresenceExistRegister, isLoading  } = result

  // Funcao para submeter os dados do Formulario Preenchido
  const onSubmit: SubmitHandler<attendance> = async (data) => {
    try {
      setIsLoadingSubmitForm(true)
      console.log('Data presenca culto: ', data)

      const status = data.status === 'true'
      const response = await axiosAuth.post(URLControlePresenca, { ...data, status })
      const presenceRedister = response.data
      if (!presenceRedister) {
        throw new Error('Failed to submit dados de presenca')
      }

      success('😉 Presenças Registradas!')
      setIsLoadingSubmitForm(false)
      reset()
      router.refresh()
    } catch (error) {
      setIsLoadingSubmitForm(false)
    }
  }

  return (
    <>
      {isLoading ? (
        <SpinnerButton message={''}/>
      ) : (
        <>
          {PresenceExistRegister ? (
            <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
              Presença já cadastrada!
            </p>
          ) : (
            <>
              <ToastContainer />
              <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
                <div className="w-full px-2 py-2 ">
                  <div className="w-full px-1 py-2 rounded-md">
                    <h2 className="mb-3 text-lg font-semibold leading-7 text-gray-800">
                      Presença de Culto
                    </h2>
                    <div className="w-full border-separate border-spacing-y-6">
                      <div className="grid grid-cols-3 text-base font-bold sm:grid-cols-5">
                        <div className="py-2 text-gray-800 border-b-2 border-blue-300 text-start">
                          Nome
                        </div>
                        <div className="hidden py-2 text-center text-gray-800 border-b-2 border-orange-300 sm:block">
                          Status
                        </div>
                        <div className="hidden py-2 text-center text-gray-800 border-b-2 border-indigo-300 sm:block">
                          Cargo
                        </div>
                        <div className="py-2 text-center text-gray-800 border-b-2 border-green-300">
                          P
                        </div>
                        <div className="py-2 text-center text-gray-800 border-b-2 border-red-300">
                          F
                        </div>
                      </div>
                      <div className="text-sm font-normal text-gray-700">
                          <form id={'supervisorId'}>
                            <div className="grid grid-cols-3 gap-4 mt-3 mb-1 sm:grid-cols-5">
                              <input
                                type="hidden"
                                value={supervisorId}
                                {...register("membro")}
                              />
                              <input
                                type="hidden"
                                value={culto}
                                {...register("presenca_culto")}
                              />
                              <div className="flex items-center justify-start gap-1 sm:gap-3">
                                <UserFocus
                                  className="hidden sm:block"
                                  size={28}
                                />
                                <h2 className="ml-4">{session?.user.first_name}</h2>
                              </div>
                              <div className="hidden sm:block">
                                <span
                                  className={`hidden w-full rounded-md px-2 py-1 text-center sm:block ${session?.user.situacao_no_reino === 'Ativo'
                                      ? 'border border-green-200 bg-green-100 ring-green-500'
                                      : session?.user.situacao_no_reino ===
                                        'Normal'
                                        ? 'border border-blue-200 bg-blue-100 ring-blue-500'
                                        : session?.user.situacao_no_reino === 'Frio'
                                          ? 'border border-orange-200 bg-orange-100 ring-orange-500'
                                          : 'border border-red-200 bg-red-100 ring-red-500'
                                    }`}
                                >
                                  {session?.user.situacao_no_reino}
                                </span>
                              </div>
                              <div className="hidden sm:block">
                                <span className="hidden w-full px-2 py-1 text-center border border-gray-200 rounded-md bg-gray-50 ring-gray-500 sm:inline">
                                  {session?.user.cargo_de_lideranca}{' '}
                                </span>
                              </div>
                              <input
                                {...register("status", {
                                  required: true
                                })}
                                value="true"
                                type="radio"
                                id={session?.user.id}
                                className="w-4 h-4 mx-auto text-green-600 border-green-300 cursor-pointer focus:ring-green-600"
                              />
                              <input
                                {...register("status", { required: true })}
                                value="false"
                                type="radio"
                                id={session?.user.first_name}
                                className="w-4 h-4 mx-auto text-red-600 border-red-300 cursor-pointer focus:ring-red-600"
                              />
                            </div>
                          </form>
                        {isLoadingSubmitForm ? (
                          <button
                            type="submit"
                            disabled={isLoadingSubmitForm}
                            className="mx-auto flex w-full items-center justify-center rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-white animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Registrando...</span>
                          </button>
                        ) : (
                          <button
                            className="mx-auto mt-3 w-full rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                          >
                            Registrar
                          </button>
                        )}
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
