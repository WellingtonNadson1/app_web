'use client'
import Calendar from '@/components/Calendar'
import Modal from '@/components/modal'
import {
  FetchError,
  errorCadastro,
  fetchWithToken,
  success,
} from '@/functions/functions'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { CultoDaSemana, NewCulto } from './schemaNewCulto'

export default function Cultos() {
  const { data: session } = useSession()
  const { register, handleSubmit, reset } = useForm<NewCulto>()
  const hostname = 'app-ibb.onrender.com'
  const URLCultosIndividuais = `https://${hostname}/cultosindividuais`
  const URLCultosSemanais = `https://${hostname}/cultossemanais`
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [dataCultos, setDataCultos] = useState<NewCulto[]>()
  const [showModal, setShowModal] = useState<boolean>(false)

  const onSubmit: SubmitHandler<NewCulto> = async (data) => {
    try {
      setIsLoadingSubmitForm(true)

      const formatDatatoISO8601 = (dataString: string) => {
        const dataObj = new Date(dataString)
        return dataObj.toISOString()
      }

      data.data_inicio_culto = formatDatatoISO8601(data.data_inicio_culto)
      data.data_termino_culto = formatDatatoISO8601(data.data_termino_culto)

      const response = await fetch(URLCultosIndividuais, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsLoadingSubmitForm(false)
        setFormSuccess(true)
        success('Culto Cadastrado')
        setShowModal(false)
      } else {
        errorCadastro('Erro ao cadastrar Culto')
        setIsLoadingSubmitForm(false)
        setShowModal(false)
      }
    } catch (error) {
      console.log(error)
      errorCadastro('Erro ao cadastrar Culto')
      setIsLoadingSubmitForm(false)
      setShowModal(false)
    }
    reset()
  }

  const { data: cultosSemanais, isLoading } = useSWR<CultoDaSemana[]>(
    [URLCultosSemanais, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )

  const fetchCultos = useCallback(async () => {
    try {
      const response = await fetch(URLCultosIndividuais, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      if (!response.ok) {
        const error: FetchError = new Error('Failed to fetch get Cultos.')
        error.status = response.status
        throw error
      }
      const cultos = await response.json()
      setDataCultos(cultos)
    } catch (error) {
      console.log(error)
    }
  }, [URLCultosIndividuais, session?.user.token])

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
        <div className="flex items-center justify-between">
          <div className="sm:w-1/2"></div>
          <button
            type="button"
            onClick={() => setShowModal(!showModal)}
            className="rounded-md bg-[#014874] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874] sm:w-2/5"
          >
            Cadastrar
          </button>
        </div>
        <Modal titleModal="Cadastro de Culto" isShow={showModal}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border-b border-gray-900/10 pb-12">
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
              </div>

              {/* Botões para submeter Forms */}
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button className="px-3 py-2 text-sm font-semibold text-slate-700 hover:rounded-md hover:bg-red-500 hover:px-3 hover:py-2 hover:text-white">
                    Cancelar
                  </button>
                  {isLoadingSubmitForm ? (
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="submit"
                        disabled={isLoadingSubmitForm}
                        className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}
