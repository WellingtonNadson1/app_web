// 'use client'
// import SpinnerButton from '@/components/spinners/SpinnerButton'
// import { BASE_URL, errorCadastro, success } from '@/functions/functions'
// import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
// import { User, UserFocus } from '@phosphor-icons/react'
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { AxiosError } from 'axios'
// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import { SubmitHandler, useForm } from 'react-hook-form'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import ProgressBar from "@ramonak/react-progress-bar";
// import { ControlePresencaCelulaProps, attendance } from '@/app/(celula)/celula/schema'

// export default function ControleDiscipuladosCelula({
//   culto,
//   celula,
// }: ControlePresencaCelulaProps) {
//   const celulaSort = celula.membros.sort((a, b) => a.first_name.localeCompare(b.first_name))
//   const URLControlePresenca = `${BASE_URL}/presencacultos`
//   const URLPresencaCultoId = `${BASE_URL}/presencacultosbycelula/${culto}/${celula.lider.id}`
//   const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
//   const [presencaReuniaoIsRegistered, setPresencaReuniaoIsRegistered] = useState<boolean>()
//   const [progress, setProgress] = useState(0);
//   const router = useRouter()
//   const { handleSubmit, register, reset, formState: { errors }, setValue } = useForm<attendance[]>()
//   const { data: session } = useSession()
//   const axiosAuth = useAxiosAuth(session?.user.token as string)
//   const queryClient = useQueryClient()

//   const getPresenceRegistered = async () => {
//     const response = await axiosAuth.get(URLPresencaCultoId)
//     const PresenceExistRegistered = response.data
//     return PresenceExistRegistered
//   }

//   const { isLoading, refetch: refetchPresence } = useQuery({
//     queryKey: ['presence'],
//     queryFn: getPresenceRegistered,
//     refetchOnWindowFocus: false,
//     onSuccess: async (responseData) => {
//       queryClient.invalidateQueries({ queryKey: ['reuniaocelula'] });
//       setPresencaReuniaoIsRegistered(true)
//       console.debug('success mutate', responseData);
//     },
//     onError: async (errorData) => {
//       const axiosError = errorData as AxiosError;
//       if (axiosError.response) {
//         const errorResponseData = axiosError.response.data;
//         console.debug('error mutate', errorResponseData);
//       } else {
//         console.error('Error response is not available');
//       }
//     },
//     retry: false
//   })

//   const mutation = useMutation(async (data: attendance[]) => {
//     // Transforma o objeto data em um array
//     const dataArray = Object.values(data)
//     const totalRecords = dataArray.length;
//     const increment = 100 / totalRecords;
//     let currentProgress = 0;

//     // Use loop for ...of
//     for (const currentData of dataArray) {
//       try {
//         const response = await axiosAuth.post(URLControlePresenca, {
//           ...currentData,
//           status: currentData.status === 'true',
//         });

//         // Atualize o progresso com base no incremento
//         currentProgress += increment;
//         currentProgress = Math.min(currentProgress, 100);
//         const formattedProgress = currentProgress.toFixed(2);
//         const numericProgress = parseFloat(formattedProgress);
//         setProgress(numericProgress); // Garanta que não exceda 100%

//         if (!response.data) {
//           throw new Error('Failed to submit dados de presenca');
//         }
//       } catch (error) {
//         console.error('Error submitting member data:', error);
//         // Lide com o erro conforme necessário
//       }
//     }

//   }, {
//     onSuccess: async () => {
//       success('😉 Presenças Registradas!')
//       setPresencaReuniaoIsRegistered(true)
//     }
//   })

//   // Funcao para submeter os dados do Formulario Preenchido
//   const onSubmit: SubmitHandler<attendance[]> = async (data) => {
//     try {
//       setIsLoadingSubmitForm(true)
//       await mutation.mutateAsync(data)
//       setIsLoadingSubmitForm(false)
//     } catch (error) {
//       errorCadastro('Já existem presenças registradas!')
//       setIsLoadingSubmitForm(false)
//     }
//   }

//   return (
//     <>
//       {isLoading ? (
//         <SpinnerButton message={''} />
//       ) : (
//         <>
//           {isLoading ? (<SpinnerButton message='' />) : (
//             <>
//               {presencaReuniaoIsRegistered ? (
//                 <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
//                   Presença já cadastrada!
//                 </p>
//               ) : (
//                 <>
//                   <ToastContainer />
//                   <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
//                     <div className="w-full px-2 py-2 ">
//                       <div className="w-full px-1 py-2 rounded-md">
//                         <h2 className="mb-6 text-base font-medium leading-8 text-gray-800">
//                           Presença de Culto
//                         </h2>
//                         {isLoadingSubmitForm && (
//                           <ProgressBar bgColor='#1e40af' baseBgColor='#e5e7eb' completed={progress} />
//                         )
//                         }
//                         <div className="w-full border-separate border-spacing-y-6">
//                           <div className="flex items-center justify-between">
//                             <div className="w-full py-2 text-gray-800 border-b-2 border-blue-300 text-start">
//                               Nome
//                             </div>
//                             <div className="hidden w-full py-2 text-center text-gray-800 border-b-2 border-orange-300 sm:block">
//                               Status
//                             </div>
//                             <div className="hidden w-full py-2 text-center text-gray-800 border-b-2 border-indigo-300 sm:block">
//                               Cargo
//                             </div>
//                             <div className='flex items-center justify-between w-full'>
//                               <div className="w-full px-2 py-2 text-center text-gray-800 border-b-2 border-green-300">
//                                 P
//                               </div>
//                               <div className="w-full px-2 py-2 text-center text-gray-800 border-b-2 border-red-300">
//                                 F
//                               </div>
//                             </div>

//                           </div>
//                           <div className="text-sm font-normal text-gray-700">
//                             {celulaSort.map((user, index) => (
//                               <form key={user.id} id={user.id}>
//                                 <div className="flex items-center justify-between w-full">
//                                   <input
//                                     type="hidden"
//                                     value={user.id}
//                                     {...register(`${index}.membro`)}
//                                   />
//                                   <input
//                                     type="hidden"
//                                     value={culto}
//                                     {...register(`${index}.presenca_culto`)}
//                                   />
//                                   <div className="flex items-center justify-start w-full gap-1 my-2 mr-2 sm:gap-3">
//                                     <div className='p-1 border rounded-full bg-slate-50 border-[#1F70B6]'>
//                                       <User size={20} />
//                                     </div>
//                                     <h2 className="ml-4">{user.first_name}</h2>
//                                   </div>
//                                   <div className="hidden w-full text-center sm:block">
//                                     <span
//                                       className={`hidden w-full rounded-md px-2 py-1 text-center sm:block ${user.situacao_no_reino?.nome === 'Ativo'
//                                         ? 'border border-green-200 bg-green-100 ring-green-500'
//                                         : user.situacao_no_reino?.nome ===
//                                           'Normal'
//                                           ? 'border border-blue-200 bg-blue-100 ring-blue-500'
//                                           : user.situacao_no_reino?.nome === 'Frio'
//                                             ? 'border border-orange-200 bg-orange-100 ring-orange-500'
//                                             : 'border border-red-200 bg-red-100 ring-red-500'
//                                         }`}
//                                     >
//                                       {user.situacao_no_reino.nome}
//                                     </span>
//                                   </div>
//                                   <div className="hidden w-full text-center sm:block">
//                                     <span className="hidden w-full px-2 py-1 text-center border border-gray-200 rounded-md bg-gray-50 ring-gray-500 sm:inline">
//                                       {user.cargo_de_lideranca.nome}{' '}
//                                     </span>
//                                   </div>
//                                   <div className='flex w-full items-center justify-end gap-3.5'>
//                                     <div className='w-full text-center'>
//                                       <input
//                                         {...register(`${index}.status` as const, {
//                                           required: true
//                                         })}
//                                         value="true"
//                                         type="radio"
//                                         id={user.id}
//                                         className="w-4 h-4 mx-auto text-green-600 border-green-300 cursor-pointer focus:ring-green-600"
//                                       />
//                                     </div>
//                                     <div className='w-full text-center'>
//                                       <input
//                                         {...register(`${index}.status` as const, { required: true })}
//                                         value="false"
//                                         type="radio"
//                                         id={user.first_name}
//                                         className="w-4 h-4 mx-auto text-red-600 border-red-300 cursor-pointer focus:ring-red-600"
//                                       />
//                                     </div>
//                                   </div>

//                                 </div>
//                               </form>
//                             ))}
//                             {isLoadingSubmitForm ? (
//                               <button
//                                 type="submit"
//                                 disabled={isLoadingSubmitForm}
//                                 className="mx-auto flex w-full items-center justify-center rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
//                               >
//                                 <svg
//                                   className="w-5 h-5 mr-3 text-white animate-spin"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <circle
//                                     className="opacity-25"
//                                     cx="12"
//                                     cy="12"
//                                     r="10"
//                                     stroke="currentColor"
//                                     strokeWidth="4"
//                                   ></circle>
//                                   <path
//                                     className="opacity-75"
//                                     fill="currentColor"
//                                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                   ></path>
//                                 </svg>
//                                 <span>Registrando...</span>
//                               </button>
//                             ) : (
//                               <button
//                                 className="mx-auto mt-3 w-full rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
//                                 type="submit"
//                                 onClick={handleSubmit(onSubmit)}
//                               >
//                                 Registrar
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </>
//           )}
//         </>
//       )}
//     </>
//   )
// }
