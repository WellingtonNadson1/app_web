'use client'

import { ICelula } from '@/components/ListCelulas'
import ListTemaLicoesCelula from '@/components/ListTemaLicoesCelula'
import Modal from '@/components/modal'
import { BASE_URL, errorCadastro, fetchWithToken, success } from '@/functions/functions'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'
import useSWR from 'swr'
import { z } from 'zod'
import { AddressProps } from '../../novo-membro/schema'

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

export default function AddNewTemaLicoesCelula() {
    // const hostname = 'backibb-w7ri-dev.fl0.io'
    const URLSupervisoes = `${BASE_URL}/supervisoes`
    const URLCelulas = `${BASE_URL}/celulas`
    const router = useRouter()

    const { data: session } = useSession()
    const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
    const [formSuccess, setFormSuccess] = useState(false)
    const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>()
    const [usersSupervisaoSelecionada, setUsersSupervisaoSelecionada] = useState<
        User[]
    >([])
    const [dataCelulas, setDataCelulas] = useState<ICelula[]>()
    const { register, handleSubmit, reset, setValue } = useForm<FormCelula>()

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

    const onSubmit: SubmitHandler<FormCelula> = async (data) => {
        try {
            console.log('Celula: ', data)
            setIsLoadingSubmitForm(true)

            const formatDatatoISO8601 = (dataString: string) => {
                const dataObj = new Date(dataString)
                return dataObj.toISOString()
            }

            data.date_inicio = formatDatatoISO8601(data.date_inicio)
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
                success('Célula Cadastrada')
            } else {
                errorCadastro('Erro ao Cadastrar Célula')
            }
        } catch (error) {
            console.log(error)
            errorCadastro('Erro ao Cadastrar Célula')
        }
        reset()
    }

    const {
        data: supervisoes,
        error,
        isLoading,
    } = useSWR<SupervisaoData[]>(
        [URLSupervisoes, `${session?.user.token}`],
        ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
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

    return (
        <>
            <Modal
                icon={UserPlusIcon}
                titleModal="Tema de Lições de Céula"
                titleButton="+ Add Tema de Lições de Célula"
                buttonProps={{
                    className:
                        'z-10 rounded-md bg-slate-950 text-white px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]',
                }}
            >
                <div className="relative mx-auto w-full px-2 py-2">
                    <div className="flex justify-between">
                        <div className="relative mx-auto px-2 py-7">
                            <div className="mx-auto rounded-lg bg-white p-6">
                                {/* Incio do Forms */}
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="pb-3">
                                        <h2 className="text-sm uppercase leading-normal text-gray-400">
                                            Tema de Lições de Célula
                                        </h2>
                                        <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-9">
                                            <div className="sm:col-span-3">
                                                <label
                                                    htmlFor="nome"
                                                    className="block text-sm font-medium leading-6 text-slate-700"
                                                >
                                                    Tema das Lições
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

                                            <div className="sm:col-span-3">
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

                                            <div className="sm:col-span-3">
                                                <label
                                                    htmlFor="date_multipicar"
                                                    className="block text-sm font-medium leading-6 text-slate-700"
                                                >
                                                    Dt. Final.
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

                                        {/* Informações para Localização */}
                                        <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                                            <div className="sm:col-span-6">
                                                <hr className="mx-0 my-4 h-px border-0 bg-transparent bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                                                <h2 className="mt-8 text-sm uppercase leading-normal text-gray-400">
                                                    Descrição
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label
                                                    htmlFor="cep"
                                                    className="block text-sm font-medium leading-6 text-slate-700"
                                                >
                                                    Descrição
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
                                                    Versículo Chave
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
                                                    className="flex items-center justify-between rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
            </Modal>


            {/* Cadastrar Nova Célula */}

            <div className="relative z-10 mx-auto w-full px-2 py-2">
                {isLoading ? (
                    <pre>Loading...</pre>
                ) : (
                  dataCelulas &&  <ListTemaLicoesCelula data={dataCelulas} />
                )}
            </div>
        </>
    )
}
