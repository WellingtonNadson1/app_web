'use client'
import { UserFocus } from '@phosphor-icons/react'
import { z } from 'zod'
// import { useEffect, useState } from 'react'

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
  userId: z.string(),
})

export type CelulaProps = z.infer<typeof CelulaSchema>

interface ControlePresencaCelulaProps {
  celula: CelulaProps
}

export default function ControlePresencaCelula({
  celula,
}: ControlePresencaCelulaProps) {
  return (
    <>
      <div className="relative mx-auto w-full rounded-xl bg-white px-4 py-2 shadow-lg">
        <div className="w-full px-2 py-2 ">
          <div className="w-full rounded-md px-1 py-2">
            <h2 className="text-lg font-semibold leading-7 text-gray-800">
              Lista de Presença
            </h2>
            <table className="w-full table-auto border-separate border-spacing-y-6">
              <thead>
                <tr className="text-base font-bold ">
                  <th className="border-b-2 border-blue-300 py-2 text-start text-gray-800">
                    Nome
                  </th>
                  <th className="border-b-2 border-orange-300 py-2 text-gray-800">
                    Status
                  </th>
                  <th className="hidden border-b-2 border-indigo-300 py-2 text-gray-800 sm:block">
                    Cargo
                  </th>
                  <th className="border-b-2 border-green-300 py-2 text-gray-800">
                    P
                  </th>
                  <th className="border-b-2 border-red-300 py-2 text-gray-800">
                    F
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {celula && celula.membros ? (
                  celula.membros.map((user) => (
                    <tr
                      className="border-b border-gray-200 py-8 hover:bg-gray-100/90"
                      key={user.id}
                    >
                      <td>
                        <div className="flex items-center justify-start gap-3">
                          <UserFocus size={24} />
                          <h2 className="ml-4">{user.first_name}</h2>
                        </div>
                      </td>
                      <td className="text-center">
                        <span
                          className={`inline w-full rounded-md px-2 py-1 text-center ${
                            user.situacao_no_reino?.nome === 'Ativo'
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
                      </td>
                      <td className="text-center">
                        <span className="hidden w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-center ring-gray-500 sm:inline">
                          {user.cargo_de_lideranca.nome}
                        </span>
                      </td>

                      <td className="mr-1 text-center">
                        <input
                          id="presente"
                          name={user.first_name}
                          value={user.id}
                          type="radio"
                          className="h-4 w-4 cursor-pointer border-green-300 text-green-600 focus:ring-green-600"
                        />
                      </td>
                      <td className="ml-1 text-center">
                        <input
                          id="faltou"
                          name={user.first_name}
                          value={user.id}
                          type="radio"
                          className="h-4 w-4 cursor-pointer border-red-300 text-red-600 focus:ring-red-600"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>
                      <p className="flex items-center justify-center gap-2">
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
                        Carregando...
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              className="mx-auto w-full rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
              type="submit"
            >
              Registrar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
