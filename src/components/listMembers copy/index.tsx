// 'use client'
// import { UserFocus } from '@phosphor-icons/react'
// import { useState } from 'react'
// import Pagination from '../Pagination'
// import { ReturnMembers } from '@/app/(central)/novo-membro/schema';
// import AddNewMember from '@/app/(central)/novo-membro/AddNewMember';
// import DeleteMember from '@/app/(central)/novo-membro/DeleteMember';
// import UpdateMember from '@/app/(central)/novo-membro/UpdateMember';
// // import { useEffect, useState } from 'react'

// interface ListMembersProps {
//   members: ReturnMembers[];
// }

// export default function ListMembers({ members }: ListMembersProps) {
//   const [shouldFetch, setShouldFetch] = useState<boolean>(false)

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage)
//   }

//   // Pagination
//   const itemsPerPage = 10
//   const [currentPage, setCurrentPage] = useState(1)

//   const startIndex = (currentPage - 1) * itemsPerPage
//   const endIndex = startIndex + itemsPerPage
//   const displayedMembers = members?.slice(startIndex, endIndex)

//     return (
//     <>
//       <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
//         <div className="w-full px-2 py-2 ">
//           <div className="w-full px-1 py-2 rounded-md">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold leading-7 text-gray-800">
//                 Lista Geral de Membros IBB
//               </h2>
//               <AddNewMember />
//             </div>
//             <table className="w-full border-separate table-auto border-spacing-y-3">
//               <thead>
//                 <tr className="text-base font-bold ">
//                   <th className="py-2 text-gray-800 border-b-2 border-blue-300 text-start">
//                     Nome
//                   </th>
//                   <th className="hidden py-2 text-gray-800 border-b-2 border-orange-300 text-start sm:table-cell">
//                     Status
//                   </th>
//                   <th className="hidden py-2 text-gray-800 border-b-2 border-indigo-300 text-start sm:table-cell">
//                     Cargo
//                   </th>
//                   <th className="hidden py-2 text-gray-800 border-b-2 border-blue-300 text-start sm:table-cell">
//                     Supervisão
//                   </th>
//                   <th className="hidden py-2 text-gray-800 border-b-2 border-indigo-300 text-start sm:table-cell">
//                     Célula
//                   </th>
//                   <th className="py-2 text-gray-800 border-b-2 border-red-300 text-start">
//                     Opções
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="text-sm font-normal text-gray-700">
//                 {!members ? (
//                   displayedMembers?.map((user, index) => (
//                     <tr
//                       className="py-8 border-b border-gray-200 hover:bg-gray-100/90"
//                       key={user.id}
//                     >
//                       <td>
//                         <div className="flex items-center justify-start gap-3">
//                           <UserFocus size={24} />
//                           <h2 className="ml-4">{user.first_name}</h2>
//                         </div>
//                       </td>
//                       <td className="text-center">
//                         <span
//                           className={`hidden w-full items-center justify-center rounded-md px-2 py-1 text-center text-xs font-medium ring-1 ring-inset sm:table-cell ${
//                             user.situacao_no_reino?.nome === 'Ativo'
//                               ? 'bg-green-100  text-green-700 ring-green-600/20'
//                               : user.situacao_no_reino?.nome === 'Normal'
//                               ? 'bg-blue-100  text-blue-700 ring-blue-600/20'
//                               : user.situacao_no_reino?.nome === 'Frio'
//                               ? 'bg-orange-100  text-orange-700 ring-orange-600/20'
//                               : 'bg-red-100  text-red-700 ring-red-600/20'
//                           }`}
//                         >
//                           {user.situacao_no_reino?.nome}
//                         </span>
//                       </td>
//                       <td className="text-center">
//                         <span className="items-center hidden px-2 py-1 text-xs font-medium text-gray-700 rounded-md bg-gray-50 ring-1 ring-inset ring-gray-600/20 sm:table-cell">
//                           {user.cargo_de_lideranca?.nome}
//                         </span>
//                       </td>
//                       <td className="text-center">
//                         <span className="items-center hidden px-2 py-1 text-xs font-medium text-gray-700 rounded-md bg-gray-50 ring-1 ring-inset ring-gray-600/20 sm:table-cell">
//                           {user.supervisao_pertence?.nome}
//                         </span>
//                       </td>
//                       <td className="text-center">
//                         <span className="items-center hidden px-2 py-1 text-xs font-medium text-gray-700 rounded-md bg-gray-50 ring-1 ring-inset ring-gray-600/20 sm:table-cell">
//                           {user.celula?.nome}
//                         </span>
//                       </td>

//                       <td className="flex items-center justify-center gap-2 text-center">
//                         <DeleteMember
//                           member={user.id}
//                           memberName={user.first_name}
//                         />
//                         <div onClick={() => setShouldFetch(true)}>
//                           {!members && (
//                             <UpdateMember
//                               shouldFetch={shouldFetch}
//                               memberId={user.id}
//                             />
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td>
//                       <p>Carregando...</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             {/* Use the Pagination component */}
//             <Pagination
//               currentPage={currentPage}
//               totalPages={Math.ceil((members?.length || 0) / itemsPerPage)}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
