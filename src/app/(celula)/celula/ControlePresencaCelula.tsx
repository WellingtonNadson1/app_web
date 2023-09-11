'use client'
import { fetchWithToken } from '@/functions/functions'
import { UserFocus } from '@phosphor-icons/react'
// import { UserFocus } from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'
// import { Props } from 'next/script'
// import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSWR from 'swr'
import * as z from 'zod'
// import { useEffect, useState } from 'react'

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
  lider: z.string(),
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

export type CelulaProps = z.infer<typeof CelulaSchema>

const PresencaCultoCelulaSchema = z.object({
  id: z.string(),
  status: z.boolean(),
  membro: z.string(),
  presenca_culto: z.string(),
})

export type PresencaCultoProps = z.infer<typeof PresencaCultoCelulaSchema>

interface ControlePresencaCelulaProps {
  celula: CelulaProps
  culto: string
}

const attendanceSchema = z.object({
  status: z.string(),
  membro: z.string(),
  presenca_culto: z.string(),
})

interface PresenceCulto {
  id: string
  status: boolean
  presenca_culto: string | null
}

type attendance = z.infer<typeof attendanceSchema>

export default function ControlePresencaCelula({
  culto,
  celula,
}: ControlePresencaCelulaProps) {
  const { data: session } = useSession()
  const hostname = 'app-ibb.onrender.com'
  const URLControlePresenca = `https://${hostname}/presencacultos`
  const URLPresencaCultoId = `https://${hostname}/presencacultosbycelula/${culto}`
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const router = useRouter()
  const { handleSubmit, register, reset } = useForm<attendance[]>()

  const { data: PresenceExistRegister } = useSWR<PresenceCulto>(
    [URLPresencaCultoId, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
  )

  const notify = () =>
    toast.success('😉 Presenças Registradas!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  // Funcao para submeter os dados do Formulario Preenchido
  const onSubmit: SubmitHandler<attendance[]> = async (data) => {
    try {
      setIsLoadingSubmitForm(true)

      console.log('Data presenca culto: ', data)

      for (const key in data) {
        const status = data[key].status === 'true'
        const response = await fetch(URLControlePresenca, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({ ...data[key], status }),
        })
        if (!response.ok) {
          throw new Error('Failed to submit dados de presenca')
        }
      }

      notify()
      setIsLoadingSubmitForm(false)
      reset()
      router.refresh()
    } catch (error) {
      setIsLoadingSubmitForm(false)
    }
  }

  return (
    <>
      {PresenceExistRegister ?
        (
          <p className="text-lg mb-3 font-normal leading-2 text-gray-800">
            Presença já cadastrada!
          </p>
        )
        : (
          <>
            <ToastContainer />
            <div className="relative mx-auto w-full rounded-xl bg-white px-4 py-2 shadow-lg">
              <div className="w-full px-2 py-2 ">
                <div className="w-full rounded-md px-1 py-2">
                  <h2 className="text-lg mb-3 font-semibold leading-7 text-gray-800">
                    Presença de Culto
                  </h2>
                  <div className="w-full border-separate border-spacing-y-6">
                    <div className="grid grid-cols-3 text-base font-bold sm:grid-cols-5">
                      <div className="border-b-2 border-blue-300 py-2 text-start text-gray-800">
                        Nome
                      </div>
                      <div className="hidden border-b-2 text-center border-orange-300 py-2 text-gray-800 sm:block">
                        Status
                      </div>
                      <div className="hidden border-b-2 text-center border-indigo-300 py-2 text-gray-800 sm:block">
                        Cargo
                      </div>
                      <div className="border-b-2 text-center border-green-300 py-2 text-gray-800">
                        P
                      </div>
                      <div className="border-b-2 text-center border-red-300 py-2 text-gray-800">
                        F
                      </div>
                    </div>
                    <div className="text-sm font-normal text-gray-700">
                      {celula.membros.map((user, index) => (
                        <form key={user.id} id={user.id}>
                          <div className="mb-1 mt-3 grid grid-cols-3 gap-4 sm:grid-cols-5">
                            <input
                              type="hidden"
                              value={user.id}
                              {...register(`${index}.membro`)}
                            />
                            <input
                              type="hidden"
                              value={culto}
                              {...register(`${index}.presenca_culto`)}
                            />
                            <div className="flex items-center justify-start gap-1 sm:gap-3">
                              <UserFocus className="hidden sm:block" size={28} />
                              <h2 className="ml-4">{user.first_name}</h2>
                            </div>
                            <div className="hidden sm:block">
                              <span
                                className={`hidden w-full rounded-md px-2 py-1 text-center sm:block ${user.situacao_no_reino?.nome === 'Ativo'
                                    ? 'border border-green-200 bg-green-100 ring-green-500'
                                    : user.situacao_no_reino?.nome === 'Normal'
                                      ? 'border border-blue-200 bg-blue-100 ring-blue-500'
                                      : user.situacao_no_reino?.nome === 'Frio'
                                        ? 'border border-orange-200 bg-orange-100 ring-orange-500'
                                        : 'border border-red-200 bg-red-100 ring-red-500'
                                  }`}
                              >
                                {user.situacao_no_reino.nome}
                              </span>
                            </div>
                            <div className="hidden sm:block">
                              <span className="hidden w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-center ring-gray-500 sm:inline">
                                {user.cargo_de_lideranca.nome}{' '}
                              </span>
                            </div>
                            <input
                              {...register(`${index}.status` as const)}
                              value="true"
                              type="radio"
                              id={user.id}
                              className="h-4 w-4 cursor-pointer mx-auto border-green-300 text-green-600 focus:ring-green-600"
                            />
                            <input
                              {...register(`${index}.status` as const)}
                              value="false"
                              type="radio"
                              id={user.first_name}
                              className="h-4 w-4 cursor-pointer mx-auto border-red-300 text-red-600 focus:ring-red-600"
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
                            className="mr-3 h-5 w-5 animate-spin text-white"
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
  )
}
