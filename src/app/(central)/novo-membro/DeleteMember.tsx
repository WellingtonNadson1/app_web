'use client'
// import Modal from '@/components/modal'
// import { BASE_URL } from '@/functions/functions'
// import { useUserDataStore } from '@/store/UserDataStore'
// import { UserMinusIcon } from '@heroicons/react/24/outline'
// import { useRouter } from 'next/navigation'
// import { useRef, useState } from 'react'

// function DeleteMember({
//   member,
//   memberName,
// }: {
//   member: string
//   memberName: string
// }) {
//   const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)

//   const cancelButtonRef = useRef(null)

//   const { token } = useUserDataStore.getState()

//   const router = useRouter()

//   const handleDelete = async (memberId: string) => {
//     const URLUsers = `${BASE_URL}/users/${memberId}`
//     setIsLoadingSubmitForm(true)
//     const response = await fetch(URLUsers, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     if (response.ok) {
//       setIsLoadingSubmitForm(false)
//       router.refresh()
//     } else {
//       setIsLoadingSubmitForm(false)
//     }
//   }

//   return (
//     <Modal
//       icon={UserMinusIcon}
//       titleModal="Deletar Membro"
//       titleButton="Deletar"
//       buttonProps={{
//         className:
//           'z-10 rounded-md bg-red-400 text-white my-1 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:w-full',
//       }}
//     >
//       {/* Incio do Forms */}
//       <div className="relative w-full px-2 py-2 mx-auto">
//         <div className="flex justify-between">
//           <div className="relative px-2 mx-auto py-7">
//             <div className="p-6 mx-auto bg-white rounded-lg">
//               <div className="pb-12 border-b border-gray-900/10">
//                 <h2 className="text-sm leading-normal text-gray-400 uppercase">
//                   Você dejesa Deletar este Membro?{' '}
//                   <span className="font-semibold text-gray-600">
//                     {memberName}
//                   </span>
//                 </h2>
//               </div>

//               {/* Botões para submeter Forms */}
//               <div className="flex items-center justify-end mt-6 gap-x-6">
//                 <button
//                   type="button"
//                   ref={cancelButtonRef}
//                   className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-300 hover:px-3 hover:py-2 hover:text-gray-900 sm:mt-0 sm:w-auto"
//                 >
//                   Cancelar
//                 </button>
//                 {isLoadingSubmitForm ? (
//                   <button
//                     type="button"
//                     disabled={isLoadingSubmitForm}
//                     className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-red-700 rounded-md shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
//                   >
//                     <svg
//                       className="w-5 h-5 mr-3 text-white animate-spin"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     <span>Deletando...</span>
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleDelete(member)}
//                     type="submit"
//                     className="px-3 py-2 text-sm font-semibold text-white bg-red-700 rounded-md shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
//                   >
//                     <span>Deletar</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   )
// }

// export default DeleteMember

// "use client";
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/components/ui/use-toast'
import { BASE_URL } from '@/lib/axios'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Spinner, Trash } from '@phosphor-icons/react/dist/ssr'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

function DeleteMember({
  memberId,
  memberName,
}: {
  memberId: string
  memberName: string
}) {
  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth(session?.user?.token as string)

  const deleteMemberFunction = async (MemberId: string) => {
    const URLMember = `${BASE_URL}/users/${memberId}`
    try {
      const response = await axiosAuth.delete(URLMember)
      toast({
        title: 'Sucesso!!!',
        description: 'Membro DELETADO com Sucesso!!! 🥳',
      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const { mutateAsync: deleteMemberFn, isPending } = useMutation({
    mutationFn: deleteMemberFunction,
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["cultosMarcados"] });
    // },
  })

  const handleDelete = async (MemberId: string) => {
    await deleteMemberFn(MemberId)
  }

  const [open, setOpen] = useState(false)

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <DropdownMenuItem
            className="w-full flex items-center justify-between text-red-600"
            onSelect={(e) => e.preventDefault()}
          >
            Deletar
            <Trash size={18} />
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[580px]">
          <DialogHeader>
            <DialogTitle>Deletar Membro</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja deletar este Membro?
            </DialogDescription>
          </DialogHeader>
          <div className="text-center my-2 py-2 text-gray-700 border rounded-md bg-gray-50">
            {memberName}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant={'outline'} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={'destructive'}
              onClick={() => handleDelete(memberId)}
              type="submit"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-3">
                  <Spinner className="animate-spin" />
                  Deletando...
                </div>
              ) : (
                'Deletar'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DeleteMember
