'use client'
import Calendar from '@/components/Calendar/Calendar'
import Modal from '@/components/modal'
import {
  BASE_URL,
  errorCadastro,
  fetchWithToken,
  success,
} from '@/functions/functions'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { CultoDaSemana, NewCulto } from './schemaNewCulto'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'

export default function Cultos() {
  const { data: session } = useSession()
  const { register, handleSubmit, reset } = useForm<NewCulto>()
  const hostname = 'app-ibb.onrender.com'
  const URLCultosIndividuais = `${BASE_URL}/cultosindividuais`
  const URLCultosSemanais = `${BASE_URL}/cultossemanais`
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [dataCultos, setDataCultos] = useState<NewCulto[]>()
  const router = useRouter()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  const onSubmit: SubmitHandler<NewCulto> = async ({data_inicio_culto, data_termino_culto, culto_semana, presencas_culto, status}) => {
    try {
      setIsLoadingSubmitForm(true)

      const formatDatatoISO8601 = (dataString: string) => {
        const dataObj = new Date(dataString)
        return dataObj.toISOString()
      }

      data_inicio_culto = formatDatatoISO8601(data_inicio_culto)
      data_termino_culto = formatDatatoISO8601(data_termino_culto)

      const response = await axiosAuth.post(URLCultosIndividuais, {
        data_inicio_culto, data_termino_culto, culto_semana, presencas_culto, status
      })
      const cultoIsRegister = response.data

      if (cultoIsRegister) {
        setIsLoadingSubmitForm(false)
        setFormSuccess(true)
        router.refresh()
        success('Culto Cadastrado')
      } else {
        setIsLoadingSubmitForm(false)

        errorCadastro('Erro ao cadastrar Culto')
      }
    } catch (error) {
      console.log(error)
      setIsLoadingSubmitForm(false)

      errorCadastro('Erro ao cadastrar Culto')
    }
    reset()
  }

  const { data: cultosSemanais, isLoading } = useSWR<CultoDaSemana[]>(
    [URLCultosSemanais, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
  )

  const fetchCultos = useCallback(async () => {
    try {
      if (session?.user) {
      const response = await axiosAuth.get(URLCultosIndividuais)
      const cultosIndividuais = response.data
        console.log(JSON.stringify(cultosIndividuais))
        if (!cultosIndividuais) {
          console.log('Failed to fetch get Cultos.')
        }
        setDataCultos(cultosIndividuais)
      }
    } catch (error) {
      console.log(error)
    }
  }, [URLCultosIndividuais, session?.user])

  // UseEffect para buscar as células quando a página é carregada
  useEffect(() => {
    fetchCultos()
  }, [fetchCultos])

  // UseEffect para buscar as células após o envio do formulário
  useEffect(() => {
    if (formSuccess) {
      fetchCultos()
    }
  }, [formSuccess, fetchCultos])

  if (dataCultos) {
    console.log('data Cultos Modal Eventos', dataCultos)
  }

  return (
    <div className="relative mx-auto w-full px-2 py-2">
      <div className="relative mx-auto mb-4 mt-3 w-full px-2">
        <Calendar />
        <Modal
          titleButton="Cadastrar"
          icon={PencilSquareIcon}
          titleModal="Cadastro de Culto"
          buttonProps={{
            className:
              'rounded-md bg-[#014874] px-4 py-2 text-sm mt-3 shadow-sm font-medium text-white hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874] sm:w-2/5',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="pb-10">
              <div className="mt-10 grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-8">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="data_inicio_culto"
                    className="block text-sm font-medium leading-6 text-slate-700"
                  >
                    Data Início
                  </label>
                  <div className="mt-3">
                    <input
                      {...register('data_inicio_culto')}
                      type="datetime-local"
                      name="data_inicio_culto"
                      id="data_inicio_culto"
                      className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="data_termino_culto"
                    className="block text-sm font-medium leading-6 text-slate-700"
                  >
                    Data Término
                  </label>
                  <div className="mt-3">
                    <input
                      {...register('data_termino_culto')}
                      type="datetime-local"
                      name="data_termino_culto"
                      id="data_termino_culto"
                      className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              {/* INFORMAÇÕES DO REINO */}
              <div className="mt-10 grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="culto_semana"
                    className="block text-sm font-medium leading-6 text-slate-700"
                  >
                    Culto da Semana
                  </label>
                  <div className="mt-3">
                    <select
                      {...register('culto_semana')}
                      id="culto_semana"
                      name="culto_semana"
                      className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                      {isLoading ? (
                        <option value="">Carregando cultos...</option>
                      ) : (
                        <option value="">Selecione</option>
                      )}
                      {cultosSemanais &&
                        cultosSemanais?.map((cultoDaSemana) => (
                          <option
                            key={cultoDaSemana.id}
                            value={cultoDaSemana.id}
                          >
                            {cultoDaSemana.nome}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium leading-6 text-slate-700"
                  >
                    Status do Culto
                  </label>
                  <div className="mt-3">
                    <select
                      {...register('status')}
                      id="status"
                      name="status"
                      className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                      {isLoading ? (
                        <option value="">Carregando status...</option>
                      ) : (
                        <>
                          <option value="">Selecione</option>
                          <option value="Agendado">Agendado</option>
                          <option value="Cancelado">Cancelado</option>
                          <option value="Realizado">Realizado</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Botões para submeter Forms */}
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 hover:rounded-md hover:bg-red-500 hover:px-3 hover:py-2 hover:text-white"
                >
                  Cancelar
                </button>
                {isLoadingSubmitForm ? (
                  <div>
                    <button
                      type="submit"
                      disabled={isLoadingSubmitForm}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                    >
                      <svg
                        className="mr-3 h-5 w-5 animate-spin text-gray-400"
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
                      <span>Cadastrando...</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                  >
                    <span>Cadastrar</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}
