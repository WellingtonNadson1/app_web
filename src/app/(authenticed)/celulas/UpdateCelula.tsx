'use client'
import ListCelulas, { ICelula } from '@/components/ListCelulas'
import { BASE_URL, errorCadastro, success } from '@/functions/functions'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'
import { z } from 'zod'
import { AddressProps } from '../novo-membro/schema'
import Modal from '@/components/modal'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'

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

export default function UpdateCelula({
  celulaId,
  shouldFetch,
}: {
  celulaId: string
  shouldFetch: boolean
}) {
  const URLSupervisoes = `${BASE_URL}/supervisoes`
  const URLCelulaId = `${BASE_URL}/celulas/${celulaId}`
  const URLCelulas = `${BASE_URL}/celulas`
  const router = useRouter()

  const { data: session } = useSession()
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>()
  const [supervisoes, setSupervisoes] = useState<SupervisaoData[]>()
  const [usersSupervisaoSelecionada, setUsersSupervisaoSelecionada] = useState<
    User[]
  >([])
  const [dataCelulas, setDataCelulas] = useState<ICelula[]>()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)
  const { register, handleSubmit, reset, setValue } = useForm<FormCelula>({
    defaultValues: async () => {
      if (!celulaId) return {}

      const response = await axiosAuth.get(URLCelulaId)
      const dataCelula =  response.data
      console.log('Data in the Update', dataCelula)
      setValue('supervisao', dataCelula.supervisao.id)
      setValue('lider', dataCelula.lider.firt_name)
      return dataCelula
    },
  })

  const handleZipCode = async (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.maxLength = 9
    let value = e.currentTarget.value
    value = value.replace(/\D/g, '')
    value = value.replace(/^(\d{5})(\d)/, '$1-$2')
    e.currentTarget.value = value

    if (value.length === 9) {
      await handleFetchCep(value)
    }
  }

  const handleSetDataAddress = useCallback(
    (data: AddressProps) => {
      setValue('cidade', data.localidade)
      setValue('endereco', data.logradouro)
      setValue('estado', data.uf)
      setValue('bairro', data.bairro)
    },
    [setValue],
  )

  const handleFetchCep = useCallback(
    async (zipCode: string) => {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`)
        const result = response.data
        handleSetDataAddress(result)
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    },
    [handleSetDataAddress],
  )

  const onSubmit: SubmitHandler<FormCelula> = async ({
    nome,
    lider,
    supervisao,
    cep,
    cidade,
    estado,
    bairro,
    endereco,
    numero_casa,
    date_inicio,
    date_multipicar,
    date_que_ocorre,
    membros
  }) => {
    try {
      setIsLoadingSubmitForm(true)

      const formatDatatoISO8601 = (dataString: string) => {
        const dataObj = new Date(dataString)
        return dataObj.toISOString()
      }

      date_inicio = formatDatatoISO8601(date_inicio)
      date_multipicar = formatDatatoISO8601(date_multipicar)

      const response = await axiosAuth.post(URLCelulas, { 
        nome,
        lider,
        supervisao,
        cep,
        cidade,
        estado,
        bairro,
        endereco,
        numero_casa,
        date_inicio,
        date_multipicar,
        date_que_ocorre,
        membros })
      const celulaRegister = response.data

      if (celulaRegister) {
        setIsLoadingSubmitForm(false)
        setFormSuccess(true)
        success('Célula Cadastrada')
      } else {
        errorCadastro('Erro ao Cadastrar Célula')
      }
    } catch (error) {
      console.log(error)
      setIsLoadingSubmitForm(false)
      errorCadastro('Erro ao Cadastrar Célula')
    }
    reset()
  }

  useEffect(() => {
    setIsLoading(true)
    axiosAuth.get(URLSupervisoes)
      .then(response => {
        setSupervisoes(response.data);
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        setIsLoading(false)
      });
  }, []);

  const fetchCelulas = useCallback(async () => {
    try {
      const response = await axiosAuth.get(URLCelulas)
      const getCelulaRegister = response.data
      if (!getCelulaRegister) {
        console.log('Failed to fetch get Celulas.')
      }
      setDataCelulas(getCelulaRegister)
    } catch (error) {
      console.log(error)
    }
  }, [session?.user.token])

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

  return (
    <>
      <div className="relative mx-auto ">
        <div className="w-full rounded-xl ">
          <div className="flex justify-between w-full gap-3 px-1 py-2 rounded-md items center sm:justify-start">
            <Modal
              icon={UserPlusIcon}
              titleModal="Atalização de Céula"
              titleButton="Editar"
              buttonProps={{
                className:
                  'z-10 rounded-md bg-blue-950 text-white px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]',
              }}
            >
              <div className="relative w-full px-2 py-2 mx-auto">
                <div className="flex justify-between">
                  <div className="relative px-2 mx-auto py-7">
                    <div className="p-6 mx-auto bg-white rounded-lg">
                      {/* Incio do Forms */}
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="pb-3">
                          <h2 className="text-sm leading-normal text-gray-400 uppercase">
                            Atualização de Célula
                          </h2>

                          <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-9">
                            <div className="sm:col-span-3">
                              <label
                                htmlFor="nome"
                                className="block text-sm font-medium leading-6 text-slate-700"
                              >
                                Nome da Célula
                              </label>
                              <div className="mt-3">
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
                              <div className="mt-3">
                                <select
                                  {...register('date_que_ocorre')}
                                  name="date_que_ocorre"
                                  id="date_que_ocorre"
                                  className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                >
                                  <option value="">
                                    Selecione
                                  </option>
                                  <option value="0">Domingo</option>
                                  <option value="1">Segunda</option>
                                  <option value="2">Terça</option>
                                  <option value="3">Quarta</option>
                                  <option value="4">Quinta</option>
                                  <option value="5">Sexta</option>
                                  <option value="6">Sábado</option>
                                </select>
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <label
                                htmlFor="date_inicio"
                                className="block text-sm font-medium leading-6 text-slate-700"
                              >
                                Dt. Início
                              </label>
                              <div className="mt-3">
                                <input
                                  {...register('date_inicio')}
                                  type="datetime-local"
                                  name="date_inicio"
                                  id="date_inicio"
                                  className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <label
                                htmlFor="date_multipicar"
                                className="block text-sm font-medium leading-6 text-slate-700"
                              >
                                Dt. Multipli.
                              </label>
                              <div className="mt-3">
                                <input
                                  {...register('date_multipicar')}
                                  type="datetime-local"
                                  name="date_multipicar"
                                  id="date_multipicar"
                                  className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                          </div>

                          {/* INFORMAÇÕES DO REINO */}
                          <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
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
                                    <option value="">
                                      Selecione
                                    </option>
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
                                  <option value="">Selecione</option>
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
                          <div className="grid grid-cols-1 mt-3 gap-x-4 gap-y-6 sm:grid-cols-8">
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
                                    <option value="">
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
                          <div className="grid grid-cols-1 mt-3 gap-x-4 gap-y-6 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                              <hr className="h-px mx-0 my-4 bg-transparent border-0 bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                              <h2 className="mt-8 text-sm leading-normal text-gray-400 uppercase">
                                Endereço da Célula
                              </h2>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                              <label
                                htmlFor="cep"
                                className="block text-sm font-medium leading-6 text-slate-700"
                              >
                                Cep
                              </label>
                              <div className="mt-3">
                                <input
                                  {...register('cep')}
                                  maxLength={9}
                                  onKeyUp={handleZipCode}
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
                              <div className="mt-3">
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
                              <div className="mt-3">
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

                          <div className="grid grid-cols-1 mt-3 gap-x-4 gap-y-6 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                              <label
                                htmlFor="bairro"
                                className="block text-sm font-medium leading-6 text-slate-700"
                              >
                                bairro
                              </label>
                              <div className="mt-3">
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
                              <div className="mt-3">
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
                              <div className="mt-3">
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
                          <div className="flex items-center justify-end mt-6 gap-x-6">
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
                                className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                              >
                                <svg
                                  className="w-5 h-5 mr-3 text-gray-400 animate-spin"
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
                                className="px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
            </Modal>
          </div>
        </div>
      </div>
    </>
  )
}
