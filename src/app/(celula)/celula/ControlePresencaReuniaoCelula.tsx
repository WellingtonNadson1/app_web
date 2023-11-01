/* eslint-disable camelcase */
'use client'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { UserFocus } from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as z from 'zod'
import { CelulaProps } from './schema'

const PresencaCultoCelulaSchema = z.object({
  id: z.string(),
  status: z.boolean(),
  membro: z.string(),
  presenca_culto: z.string(),
})

export type PresencaCultoProps = z.infer<typeof PresencaCultoCelulaSchema>

const reuniaoCelulaDataSchema = z.object({
  id: z.string(),
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: z.string(),
})

type reuniaoCelulaData = z.infer<typeof reuniaoCelulaDataSchema>

const attendanceSchema = z.object({
  status: z.string(),
  membro: z.string(),
  which_reuniao_celula: z.string(),
})

type attendance = z.infer<typeof attendanceSchema>

export default function ControlePresencaReuniaoCelula({
  celulaId,
  dataCelula,
}: {
  celulaId: string
  dataCelula: CelulaProps
}) {
  const { data: session } = useSession()
  const URLControlePresencaReuniaoCelula = `${BASE_URL}/presencareuniaocelulas`
  const URLReuniaoCelula = `${BASE_URL}/reunioessemanaiscelulas`

  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [isLoadingCreateReuniaoCelula, setIsLoadingCreateReuniaoCelula] = useState(false)
  const [reuniaoIsRegistered, setReuniaoIsRegistered] = useState(false)
  const [dataReuniao, setDataReuniao] = useState<reuniaoCelulaData>()
  const router = useRouter()
  const { handleSubmit, register, reset } = useForm<attendance[]>()
  const axiosAuth = useAxiosAuth(session?.user.token as string)

  const notify = () =>
    toast.success('😉 Presenças de Célula Registradas!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  const notifyError = (message: string) =>
    toast.error(`😰 ${message}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  const memoizedDataHoje = useMemo(() => new Date(), [])
  const memoizedDataHojeString = memoizedDataHoje.toDateString()

  const formatDatatoISO8601 = (dataString: string) => {
    const dataObj = new Date(dataString);
    return dataObj.toISOString();
  }

  useEffect(() => {
    // Criando uma nova Reunião de Célula para que seja tirada as faltas dos membros
      const createCelula = async () => {
        setIsLoadingCreateReuniaoCelula(true)
        try {
          const status = 'Marcado'
          const celula = celulaId
          const data_reuniao = formatDatatoISO8601(memoizedDataHojeString)
          const presencas_membros_reuniao_celula = null

          const response = await axiosAuth.post(URLReuniaoCelula, {status,
            celula,
            data_reuniao,
            presencas_membros_reuniao_celula,})
          if (response.status === 201) {
            const dataReuniao = response.data
            setDataReuniao(dataReuniao)
          } else if (response.status === 409) {
            // Handle conflict here by setting reuniaoIsRegistered to true
            setReuniaoIsRegistered(true);
          } else {
            throw new Error(response.status + ': ' + response.statusText)
          }
        } catch (error) {
          if (error instanceof Error && error.message.startsWith('409')) {
            notifyError('Já existe reunião marcada para hoje!')
          }
        }
        setIsLoadingCreateReuniaoCelula(false)
      }
      createCelula()
  }, [])

  // Funcao para submeter os dados do Formulario Preenchido
  const onSubmit: SubmitHandler<attendance[]> = async (data) => {
    try {
      setIsLoadingSubmitForm(true)

      console.log('Data presenca culto: ', data)

      for (const key in data) {
        const status = data[key].status === 'true'
        const which_reuniao_celula = dataReuniao?.id

        const response = await axiosAuth.post(URLControlePresencaReuniaoCelula, {...data[key], status, which_reuniao_celula})
        if (response.status !== 201) {
          throw new Error('Failed to submit dados de presenca')
        }
      }

      notify()
      setIsLoadingSubmitForm(false)
      reset()
      router.refresh()
    } catch (error) {
      notifyError('Já existem presenças registradas!')
      setIsLoadingSubmitForm(false)
    }
  }

  return (
    <>
    {isLoadingCreateReuniaoCelula ? (
      <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
      <SpinnerButton message={''}/>
    </p>
    ) : (
      <>
        {reuniaoIsRegistered ? (
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
                    Presença de Reunião de Célula
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
                      {dataCelula.data.membros.map((user, index) => (
                        <form key={user.id} id={user.id}>
                          <div className="grid grid-cols-3 gap-4 mt-3 mb-1 sm:grid-cols-5">
                            <input
                              type="hidden"
                              value={user.id}
                              {...register(`${index}.membro`)}
                            />
                            <div className="flex items-center justify-start gap-1 sm:gap-3">
                              <UserFocus className="hidden sm:block" size={28} />
                              <h2 className="ml-4">{user.first_name}</h2>
                            </div>
                            <div className="hidden sm:block">
                              <span
                                className={`hidden rounded-md px-2 py-1 text-center sm:block ${
                                  user.situacao_no_reino?.nome === 'Ativo'
                                    ? 'border border-green-200 bg-green-100 ring-green-500'
                                    : user.situacao_no_reino?.nome === 'Normal'
                                    ? 'border border-blue-200 bg-blue-100 ring-blue-500'
                                    : user.situacao_no_reino?.nome === 'Frio'
                                    ? 'border border-orange-200 bg-orange-100 ring-orange-500'
                                    : 'border border-red-200 bg-red-100 ring-red-500'
                                }`}
                              >
                                {user.situacao_no_reino?.nome}
                              </span>
                            </div>
                            <div className="hidden sm:block">
                              <span className="hidden w-full px-2 py-1 text-center border border-gray-200 rounded-md bg-gray-50 ring-gray-500 sm:inline">
                                {user.cargo_de_lideranca?.nome}{' '}
                              </span>
                            </div>
                            <input
                              {...register(`${index}.status` as const, { required: true })}
                              value="true"
                              type="radio"
                              id={user.id}
                              className="w-4 h-4 mx-auto text-green-600 border-green-300 cursor-pointer focus:ring-green-600"
                            />
                            <input
                              {...register(`${index}.status` as const, { required: true })}
                              value="false"
                              type="radio"
                              id={user.first_name}
                              className="w-4 h-4 mx-auto text-red-600 border-red-300 cursor-pointer focus:ring-red-600"
                            />
                          </div>
                        </form>
                      ))}
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
