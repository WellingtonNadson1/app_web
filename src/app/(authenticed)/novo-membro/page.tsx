'use client'
import { useSession } from 'next-auth/react'
import React, { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import { z } from 'zod'

const MemberSchema = z.object({
  supervisao_pertence: z.string().optional(),
  celula: z.string().optional(),
  escolas: z.string().array().optional(),
  encontros: z.string().array().optional(),
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  cpf: z.string().optional(),
  date_nascimento: z.string().datetime(),
  sexo: z.string(),
  telefone: z.string(),
  escolaridade: z.string(),
  profissao: z.string().optional(),
  batizado: z.boolean(),
  date_batizado: z.string().datetime().optional(),
  is_discipulado: z.boolean(),
  discipulador: z.string().optional(),
  estado_civil: z.string(),
  nome_conjuge: z.string().optional(),
  date_casamento: z.string().datetime().optional(),
  has_filho: z.boolean(),
  quantidade_de_filho: z.number().optional(),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  bairro: z.string(),
  endereco: z.string(),
  numero_casa: z.string(),
  date_decisao: z.string().datetime().optional(),
  situacao_no_reino: z.string().optional(),
  cargo_de_lideranca: z.string().optional(),
})

type Member = z.infer<typeof MemberSchema>

type AddressProps = {
  uf: string
  bairro: string
  logradouro: string
  complemento: string
  localidade: string
}

interface Celula {
  id: string
  nome: string
}

export interface SupervisaoData {
  id: string
  nome: string
  celulas: Celula[]
}

const EscolasSchema = z
  .object({
    id: z.string(),
    nome: z.string(),
  })
  .array()

type Escolas = z.infer<typeof EscolasSchema>

const EncontrosSchema = z
  .object({
    id: z.string(),
    nome: z.string(),
  })
  .array()

type Encontros = z.infer<typeof EncontrosSchema>

const SituacoesNoReinoSchema = z
  .object({
    id: z.string(),
    nome: z.string(),
  })
  .array()

type SituacoesNoReino = z.infer<typeof SituacoesNoReinoSchema>

interface FetchError extends Error {
  status?: number
}

export default function NovoMembro() {
  const hostname = 'app-ibb.onrender.com'
  const URLSupervisoes = `https://${hostname}/supervisoes`
  const URLUsers = `https://${hostname}/users`
  const URLEscolas = `https://${hostname}/escolas`
  const URLEncontros = `https://${hostname}/encontros`
  const URLSituacoesNoReino = `https://${hostname}/situacoesnoreino`
  const URLCagosLideranca = `https://${hostname}/cargoslideranca`

  const { data: session } = useSession()
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>()
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const { register, handleSubmit, setValue, reset } = useForm<Member>()

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
        const response = await fetch(
          `https://viacep.com.br/ws/${zipCode}/json/`,
        )
        const result = await response.json()
        handleSetDataAddress(result)
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    },
    [handleSetDataAddress],
  )

  const handleCahngeIsBatizado = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'true'
    setValue(`batizado`, value)
  }

  const handleCahngeIsDiscipulado = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value === 'true'
    setValue(`is_discipulado`, value)
  }

  const handleCahngeHasFilho = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'true'
    setValue(`has_filho`, value)
  }

  // Notification sucsses or error Submit Forms
  const successCadastroMembro = () =>
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

  const errorCadastroMembro = () =>
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

  // Funcao para submeter os dados do Formulario Preenchido
  const onSubmit: SubmitHandler<Member> = async (data) => {
    try {
      const selectedIsDiscipulado = Boolean(data.is_discipulado)
      const selectedHasFilho = Boolean(data.has_filho)
      const selectedBatizado = Boolean(data.batizado)

      console.log(data.is_discipulado)

      const selectedEncontros = data?.encontros?.filter((id) => id !== '')
      const selectedEscolas = data?.escolas?.filter((id) => id !== '')

      // Verifica se não há encontros selecionados e define o valor como nulo
      const encontrosToSend =
        selectedEncontros && selectedEncontros.length === 0
          ? null
          : selectedEncontros

      const escolasToSend =
        selectedEscolas && selectedEscolas.length === 0 ? null : selectedEscolas

      const dataToSend = {
        ...data,
        encontros: encontrosToSend,
        escolas: escolasToSend,
        is_discipulado: selectedIsDiscipulado,
        has_filho: selectedHasFilho,
        batizado: selectedBatizado,
      }

      setIsLoadingSubmitForm(true)

      console.log('Data Form2: ', dataToSend)

      const response = await fetch(URLUsers, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify(dataToSend),
      })
      if (response.ok) {
        setIsLoadingSubmitForm(false)
        successCadastroMembro()
        reset()
      } else {
        errorCadastroMembro()
      }
    } catch (error) {
      errorCadastroMembro()
    }
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

  // fetchWithToken(URL, `${session?.user.token}`).then((data) => {
  //   console.log('Resultado do FetchWithToken: ', data)
  // })

  // GET Supervisoes
  const {
    data: supervisoes,
    error,
    isValidating,
    isLoading,
  } = useSWR<SupervisaoData[]>(
    [URLSupervisoes, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )
  // GET Escolas
  const { data: escolas } = useSWR<Escolas>(
    [URLEscolas, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )
  // GET Encontro
  const { data: encontros } = useSWR<Encontros>(
    [URLEncontros, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )
  // GET Situacoes no Reino
  const { data: situacoesNoReino } = useSWR<SituacoesNoReino>(
    [URLSituacoesNoReino, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )

  // GET Cargos de Lideranca
  const { data: cargoLideranca } = useSWR<SituacoesNoReino>(
    [URLCagosLideranca, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )

  if (isValidating) {
    console.log('Is Validating', isValidating)
  }

  if (error)
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto w-full">
          <div>failed to load</div>
        </div>
      </div>
    )

  if (isLoading)
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto flex w-full items-center gap-2">
          <div className="text-white">carregando...</div>
        </div>
      </div>
    )

  if (!supervisoes) {
    return (
      <div className="z-50 mx-auto w-full px-2 py-2">
        <div className="mx-auto flex w-full items-center gap-2">
          <div className="text-white">carregando...</div>
        </div>
      </div>
    )
  }

  const handleSupervisaoSelecionada = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSupervisaoSelecionada(event.target.value)
  }

  const celulasFiltradas = (supervisoes ?? []).find(
    (supervisao) => supervisao.id === supervisaoSelecionada,
  )?.celulas

  return (
    <>
      <div className="relative mx-auto w-full px-2 py-2">
        <div className="flex justify-between">
          <div className="relative mx-auto px-2 py-7">
            <div className="mx-auto rounded-lg bg-white p-6">
              {/* Incio do Forms */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-sm uppercase leading-normal text-gray-400">
                    Informações Pessoais
                  </h2>

                  <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Primeiro Nome
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('first_name')}
                          type="text"
                          name="first_name"
                          id="first_name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Sobrenome
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('last_name')}
                          type="text"
                          name="last_name"
                          id="last_name"
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="cpf"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        CPF
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('cpf')}
                          type="text"
                          name="cpf"
                          id="cpf"
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="date_nascimento"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Dt. Nasc.
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('date_nascimento')}
                          type="datetime-local"
                          id="date_nascimento"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="sexo"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Sexo
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('sexo')}
                          id="sexo"
                          name="sexo"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                          <option value={'M'}>M</option>
                          <option value={'F'}>F</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Endereço de Email
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('email')}
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="telefone"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Telefone
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('telefone')}
                          id="telefone"
                          name="telefone"
                          type="text"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="escolaridade"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Escolaridade
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('escolaridade')}
                          id="escolaridade"
                          name="escolaridade"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                          <option value={'Sem Escolaridade'}>
                            Sem Escolaridade
                          </option>
                          <option value={'Fundamental Incompleto'}>
                            Fundamental Incompleto
                          </option>
                          <option value={'Fundamental Completo'}>
                            Fundamental Completo
                          </option>
                          <option value={'Médio Incompleto'}>
                            Médio Incompleto
                          </option>
                          <option value={'Médio Completo'}>
                            Médio Completo
                          </option>
                          <option value={'Superio Incompleto'}>
                            Superio Incompleto
                          </option>
                          <option value={'Superio Completo'}>
                            Superio Completo
                          </option>
                          <option value={'Pós Graduado'}>Pós Graduado</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="profissao"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Profissão
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('profissao')}
                          id="profissao"
                          name="profissao"
                          type="text"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* INFORMAÇÕES DO REINO */}
                  <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <hr className="mx-0 my-4 h-px border-0 bg-transparent bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                      <h2 className="mt-8 text-sm uppercase leading-normal text-gray-400">
                        Informações do Reino
                      </h2>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="batizado"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Batizado
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('batizado')}
                          onChange={handleCahngeIsBatizado}
                          id="batizado"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                          <option value={'true'}>Sim</option>
                          <option value={'false'}>Não</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="date_batizado"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Dt. Batismo
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('date_batizado')}
                          id="date_batizado"
                          type="datetime-local"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="is_discipulado"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Discipulado
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('is_discipulado')}
                          onChange={handleCahngeIsDiscipulado}
                          id="is_discipulado"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="discipulador"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Discipulador
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('discipulador')}
                          id="discipulador"
                          type="text"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="supervisao_pertence"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Supervisão
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('supervisao_pertence')}
                          id="supervisao_pertence"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          onChange={handleSupervisaoSelecionada}
                        >
                          <option value={''}>Selecione</option>
                          {!isLoading ? (
                            (supervisoes ?? []).map((supervisao) => (
                              <option key={supervisao.id} value={supervisao.id}>
                                {supervisao.nome}
                              </option>
                            ))
                          ) : (
                            <option value={''}>Carregando...</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="celula"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Célula
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('celula')}
                          id="celula"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                          <option value={''}>Selecione</option>
                          {!isLoading ? (
                            (celulasFiltradas ?? []).map((celula) => (
                              <option key={celula.id} value={celula.id}>
                                {celula.nome}
                              </option>
                            ))
                          ) : (
                            <option value={''}>Carregando...</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Escolas Realizadas */}
                  <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="mt-3 sm:col-span-6">
                      <fieldset>
                        <legend className="block text-sm font-medium leading-6 text-slate-700">
                          Escolas Feitas
                        </legend>
                        <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-x-8">
                          {!isLoading ? (
                            (escolas ?? []).map((escola) => (
                              <div
                                key={escola.id}
                                className="relative flex gap-x-3"
                              >
                                <div className="flex h-6 items-center">
                                  <input
                                    {...register('escolas')}
                                    id={escola.id}
                                    value={escola.id}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                  />
                                </div>
                                <div className="text-sm leading-6">
                                  <label
                                    htmlFor={escola.id}
                                    className="font-medium text-slate-700"
                                  >
                                    {escola.nome}
                                  </label>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>Carregando...</p>
                          )}
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  {/* Econtros Realizados */}
                  <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="mt-3 sm:col-span-3">
                      <fieldset>
                        <legend className="block text-sm font-medium leading-6 text-slate-700">
                          Encontros Participados
                        </legend>
                        <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-x-8">
                          {supervisoes ? (
                            (encontros ?? []).map((encontro) => (
                              <div
                                key={encontro.id}
                                className="relative flex gap-x-3"
                              >
                                <div className="flex h-6 items-center">
                                  <input
                                    {...register('encontros')}
                                    value={encontro.id}
                                    id={encontro.id}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                  />
                                </div>
                                <div className="text-sm leading-6">
                                  <label
                                    htmlFor={encontro.id}
                                    className="font-medium text-slate-700"
                                  >
                                    {encontro.nome}
                                  </label>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>Carregando...</p>
                          )}
                        </div>
                      </fieldset>
                    </div>
                    {/* Situação No reino */}
                    <div className="mt-3 sm:col-span-3">
                      <label
                        htmlFor="situacao_no_reino"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Situação no Reino
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('situacao_no_reino')}
                          id="situacao_no_reino"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                          <option value={''}>Selecione</option>
                          {!isLoading ? (
                            (situacoesNoReino ?? []).map((situacao) => (
                              <option key={situacao.id} value={situacao.id}>
                                {situacao.nome}
                              </option>
                            ))
                          ) : (
                            <option value={''}>Carregando...</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="col-span-6">
                      <label
                        htmlFor="cargo_de_lideranca"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Cargo de Liderança
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('cargo_de_lideranca')}
                          id="cargo_de_lideranca"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                          <option value={''}>Selecione</option>
                          {!isLoading ? (
                            (cargoLideranca ?? []).map((cargo) => (
                              <option key={cargo.id} value={cargo.id}>
                                {cargo.nome}
                              </option>
                            ))
                          ) : (
                            <option value={''}>Carregando...</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* INFORMAÇÕES CONJUGAIS */}
                  <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <hr className="mx-0 my-4 h-px border-0 bg-transparent bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                      <h2 className="mt-8 text-sm uppercase leading-normal text-gray-400">
                        Informações Conjugais
                      </h2>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="estadoCivil"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Estado Civil
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('estado_civil')}
                          id="estadoCivil"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                          <option value={'Casado'}>Casado(a)</option>
                          <option value={'Solteiro'}>Solteiro(a)</option>
                          <option value={'Viuvo'}>Viúvo(a)</option>
                          <option value={'Divorciado'}>Divórciado(a)</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="nomeConjuge"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Nome Conjuge
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('nome_conjuge')}
                          type="text"
                          name="nomeConjuge"
                          id="nomeConjuge"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="dateCasamento"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Data/Casamento
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('date_casamento')}
                          type="datetime-local"
                          id="dateCasamento"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="has_filho"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Tem Filho?
                      </label>
                      <div className="mt-3">
                        <select
                          {...register('has_filho')}
                          onChange={handleCahngeHasFilho}
                          id="has_filho"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                          <option value={'true'}>Sim</option>
                          <option value={'false'}>Não</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="quantidadeFilho"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Qntd. Filho(s)
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('quantidade_de_filho')}
                          type="text"
                          id="quantidadeFilho"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informações para Visita */}
                  <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <hr className="mx-0 my-4 h-px border-0 bg-transparent bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                      <h2 className="mt-8 text-sm uppercase leading-normal text-gray-400">
                        Endereço para Visita/Contato
                      </h2>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
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
                          type="text"
                          id="cep"
                          onKeyUp={handleZipCode}
                          maxLength={9}
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
                          id="estado"
                          autoComplete="address-level1"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="col-span-2">
                      <label
                        htmlFor="bairro"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Bairro
                      </label>
                      <div className="mt-3">
                        <input
                          {...register('bairro')}
                          type="text"
                          id="bairro"
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
                          id="numero_casa"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
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
                    <button
                      type="submit"
                      disabled={isLoadingSubmitForm}
                      className="flex items-center justify-between rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
