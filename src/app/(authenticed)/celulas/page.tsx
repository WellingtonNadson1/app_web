'use client'
import ListCelulas, { ICelula } from '@/components/ListCelulas'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSWR from 'swr'
import { z } from 'zod'

const schemaFormCelula = z.object({
  nome: z.string(),
  lider: z.string().uuid(),
  supervisao: z.string().uuid(),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  bairro: z.string(),
  endereco: z.string(),
  numero_casa: z.string(),
  date_inicio: z.string().datetime(),
  date_multipicar: z.string().datetime(),
  date_que_ocorre: z.string().datetime(),
  membros: z.string().uuid().array(),
})

type FormCelula = z.infer<typeof schemaFormCelula>

interface Celula {
  id: string
  nome: string
  lider: {
    id: string
    first_name: string
  }
}

interface FetchError extends Error {
  status?: number
}

interface User {
  id: string
  first_name?: string
}

export interface SupervisaoData {
  id: string
  nome: string
  celulas: Celula[]
  membros: User[]
}

export default function Celulas() {
  // const hostname = 'backibb-w7ri-dev.fl0.io'
  const hostname = 'app-ibb.onrender.com'
  const URLSupervisoes = `https://${hostname}/supervisoes`
  const URLCelulas = `https://${hostname}/celulas`

  const { data: session } = useSession()
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>()
  const [usersSupervisaoSelecionada, setUsersSupervisaoSelecionada] = useState<
    User[]
  >([])
  const [dataCelulas, setDataCelulas] = useState<ICelula[]>()
  const { register, handleSubmit, reset } = useForm<FormCelula>()

  // Notification sucsses or error Submit Forms
  const success = () =>
    toast.success('Célula Cadastrada!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  const errorCadastro = () =>
    toast.error('Error no Cadastro!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  const onSubmit: SubmitHandler<FormCelula> = async (data) => {
    try {
      setIsLoadingSubmitForm(true)

      const formatDatatoISO8601 = (dataString: string) => {
        const dataObj = new Date(dataString)
        return dataObj.toISOString()
      }

      data.date_inicio = formatDatatoISO8601(data.date_inicio)
      data.date_que_ocorre = formatDatatoISO8601(data.date_que_ocorre)
      data.date_multipicar = formatDatatoISO8601(data.date_multipicar)

      const response = await fetch(URLCelulas, {
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
        success()
      } else {
        errorCadastro()
      }
    } catch (error) {
      console.log(error)
      errorCadastro()
    }
    reset()
  }

  async function fetchWithToken(url: string, token: string) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        const error: FetchError = new Error('Failed to fetch data with token.')
        error.status = response.status
        throw error
      }
      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error while fetching data with token:', error.message)
        throw error
      } else {
        console.error('Unknown error occurred:', error)
        throw new Error('Unknown error occurred.')
      }
    }
  }

  const {
    data: supervisoes,
    error,
    isValidating,
    isLoading,
  } = useSWR<SupervisaoData[]>(
    [URLSupervisoes, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )

  const fetchCelulas = useCallback(async () => {
    try {
      const response = await fetch(URLCelulas, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      if (!response.ok) {
        const error: FetchError = new Error('Failed to fetch get Celulas.')
        error.status = response.status
        throw error
      }
      const celulas = await response.json()
      setDataCelulas(celulas)
    } catch (error) {
      console.log(error)
    }
  }, [URLCelulas, session?.user.token])

  // UseEffect para buscar as células quando a página é carregada
  useEffect(() => {
    fetchCelulas()
  }, [fetchCelulas])

  // UseEffect para buscar as células após o envio do formulário
  useEffect(() => {
    if (formSuccess) {
      fetchCelulas()
    }
  }, [formSuccess, fetchCelulas])

  const handleSupervisaoSelecionada = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSupervisaoSelecionada(event.target.value)
  }

  useEffect(() => {
    if (supervisaoSelecionada) {
      // Use the selected supervision ID to filter the list of users
      const selectedSupervisao = supervisoes?.find(
        (supervisao) => supervisao.id === supervisaoSelecionada,
      )
      if (selectedSupervisao) {
        setUsersSupervisaoSelecionada(selectedSupervisao.membros)
      } else {
        setUsersSupervisaoSelecionada([])
      }
    }
  }, [supervisaoSelecionada, supervisoes])

  if (isValidating) {
    console.log('Is Validating', isValidating)
  }

  if (error)
    return (
      <div className="z-50 mx-auto w-full px-2 py-2">
        <div className="mx-auto w-full">
          <div className="text-white">failed to load</div>
        </div>
      </div>
    )

  if (isLoading)
    return (
      <div className="z-50 mx-auto w-full px-2 py-2">
        <div className="mx-auto flex w-full items-center gap-2">
          <div className="text-white">carregando...</div>
        </div>
      </div>
    )

  if (!isLoading) {
    console.log('Carregando...')
  }

  return (
    <>
      {/* Cadastrar Nova Célula */}
      <div className="relative mx-auto w-full px-2 py-2">
        <div className="flex justify-between">
          <div className="relative mx-auto px-2 py-7">
            <div className="mx-auto rounded-lg bg-white p-6">
              {/* Incio do Forms */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-sm uppercase leading-normal text-gray-400">
                    Cadastro de Célula
                  </h2>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="nome"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Nome da Célula
                      </label>
                      <div className="mt-2">
                        <input
                          {...register('nome')}
                          type="text"
                          name="nome"
                          id="nome"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="date_que_ocorre"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Dia que Ocorre
                      </label>
                      <div className="mt-2">
                        <input
                          {...register('date_que_ocorre')}
                          type="datetime-local"
                          name="date_que_ocorre"
                          id="date_que_ocorre"
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="date_inicio"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Dt. Início
                      </label>
                      <div className="mt-2">
                        <input
                          {...register('date_inicio')}
                          type="datetime-local"
                          name="date_inicio"
                          id="date_inicio"
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="date_multipicar"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Dt. para Multiplicação
                      </label>
                      <div className="mt-2">
                        <input
                          {...register('date_multipicar')}
                          type="datetime-local"
                          name="date_multipicar"
                          id="date_multipicar"
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* INFORMAÇÕES DO REINO */}
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="supervisao"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Supervisão
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('supervisao')}
                          id="supervisao"
                          name="supervisao"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          onChange={handleSupervisaoSelecionada}
                        >
                          {!supervisoes ? (
                            <option value="">Carregando supervisões...</option>
                          ) : (
                            <option value="">Selecione</option>
                          )}
                          {supervisoes &&
                            supervisoes?.map((supervisao) => (
                              <option key={supervisao.id} value={supervisao.id}>
                                {supervisao.nome}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="lider"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Líder
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('lider')}
                          id="lider"
                          name="lider"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                          <option disabled={true} value="">
                            Selecione
                          </option>
                          {supervisaoSelecionada &&
                            usersSupervisaoSelecionada?.map((lider) => (
                              <option key={lider.id} value={lider.id}>
                                {lider.first_name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Escolha dos Membros da Celula */}
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                    <div className="sm:col-span-4">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="membros"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Membros
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('membros')}
                            multiple={true}
                            id="membros"
                            name="membros"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option disabled={true} value="">
                              Selecione
                            </option>
                            {supervisaoSelecionada &&
                              usersSupervisaoSelecionada?.map((membro) => (
                                <option key={membro.id} value={membro.id}>
                                  {membro.first_name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações para Localização */}
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <hr className="mx-0 my-4 h-px border-0 bg-transparent bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                      <h2 className="mt-8 text-sm uppercase leading-normal text-gray-400">
                        Endereço da Célula
                      </h2>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="cep"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Cep
                      </label>
                      <div className="mt-2">
                        <input
                          {...register('cep')}
                          type="text"
                          name="cep"
                          id="cep"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="cidade"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Cidade
                      </label>
                      <div className="mt-2">
                        <input
                          {...register('cidade')}
                          type="text"
                          name="cidade"
                          id="cidade"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="estado"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Estado
                      </label>
                      <div className="mt-2">
                        <input
                          {...register('estado')}
                          type="text"
                          name="estado"
                          id="estado"
                          autoComplete="address-level1"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="bairro"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        bairro
                      </label>
                      <div className="mt-2">
                        <input
                          {...register('bairro')}
                          type="text"
                          name="bairro"
                          id="bairro"
                          autoComplete="address-level1"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <label
                        htmlFor="endereco"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Endereço
                      </label>
                      <div className="mt-2">
                        <input
                          {...register('endereco')}
                          type="text"
                          name="endereco"
                          id="endereco"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label
                        htmlFor="numero_casa"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Nº
                      </label>
                      <div className="mt-2">
                        <input
                          {...register('numero_casa')}
                          type="text"
                          name="numero_casa"
                          id="numero_casa"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botões para submeter Forms */}
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      className="px-3 py-2 text-sm font-semibold text-slate-700 hover:rounded-md hover:bg-red-500 hover:px-3 hover:py-2 hover:text-white"
                    >
                      Cancelar
                    </button>
                    {isLoadingSubmitForm ? (
                      <button
                        type="submit"
                        disabled={isLoadingSubmitForm}
                        className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
                        <span>Cadastrando...</span>
                      </button>
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
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full px-2 py-2">
        {isLoading ? (
          <pre>Loading...</pre>
        ) : (
          dataCelulas && <ListCelulas data={dataCelulas} />
        )}
      </div>
    </>
  )
}
