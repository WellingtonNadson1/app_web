import SpinnerButton from '@/components/spinners/SpinnerButton'
import React from 'react'

function LoadingListCelula() {
    return (
        <>
            <div className="relative w-full px-6 py-2 mx-auto mt-8 bg-white shadow-lg rounded-xl">
                <div className="w-full px-2 py-2 ">
                    <div className="w-full px-1 py-2 rounded-md">
                        <div className="flex items-center justify-between">
                            {/* ... Outros elementos do cabeçalho ... */}
                            <div>
                                <div className='flex items-center justify-between gap-3 sm:justify-start'>
                                    <h2 className="py-6 text-lg font-semibold leading-7 text-gray-800">
                                        Lista Geral de Células IBB
                                    </h2>
                                    <div className='items-center justify-center px-2 py-1 text-xs font-medium text-center rounded-md felx ring-1 ring-inset bg-blue-50 text-sky-700 ring-blue-600/20 sm:block'>
                                        <p className='flex items-center justify-center animate-pulse'>Total <span className='items-center inline-block w-6 h-4 ml-2 text-white rounded-md bg-sky-700'></span></p>
                                    </div>
                                </div>
                            </div>
                            <button className='h-4 w-35 animate-pulse'></button>
                        </div>
                    </div>
                    <table className="w-full border-separate table-auto border-spacing-y-3">
                        {/* ... Cabeçalho da tabela ... */}
                        <thead>
                            <tr className="text-base font-bold ">
                                <th className="py-2 text-gray-800 text-start">
                                    Ord.
                                </th>
                                <th className="hidden py-2 text-gray-800 text-start sm:table-cell">
                                    Célula
                                </th>
                                <th className="hidden py-2 text-gray-800 text-start sm:table-cell">
                                    Líder(es)
                                </th>
                                <th className="hidden py-2 text-gray-800 text-start sm:table-cell">
                                    Detalhes
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-normal text-gray-700">
                            {Array.from({ length: 10 }).map((_, index) => ( // Suponhamos que você queira renderizar 5 linhas de esqueleto
                                <tr key={index} className="py-8 border-b border-gray-200">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <span>{index + 1}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 h-4 bg-gray-300 animate-pulse"></div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 h-4 bg-gray-300 animate-pulse"></div>
                                        </div>
                                    </td>
                                    <td>
                        <div className="flex items-center justify-center w-full gap-2 mx-auto text-center">
                          <button
                            className="'z-10 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700'"
                          >
                            Acessar
                          </button>
                          <button
                            className="'z-10 rounded-md bg-blue-950 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700'"
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                                    {/* ... Outras células de esqueleto ... */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default LoadingListCelula