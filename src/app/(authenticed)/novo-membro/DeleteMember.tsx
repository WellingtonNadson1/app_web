'use client'
import Modal from '@/components/modal'
import { UserMinusIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

function DeleteMember({
  member,
  memberName,
}: {
  member: string
  memberName: string
}) {
  const hostname = 'app-ibb.onrender.com'
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)

  const cancelButtonRef = useRef(null)

  const { data: session } = useSession()

  const router = useRouter()

  const handleDelete = async (memberId: string) => {
    const URLUsers = `https://${hostname}/users/${memberId}`
    setIsLoadingSubmitForm(true)
    const response = await fetch(URLUsers, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user.token}`,
      },
    })
    if (response.ok) {
      setIsLoadingSubmitForm(false)
      router.refresh()
    } else {
      setIsLoadingSubmitForm(false)
    }
  }

  return (
    <Modal
      icon={UserMinusIcon}
      titleModal="Deletar Membro"
      titleButton="Deletar"
      buttonProps={{
        className:
          'z-10 rounded-md bg-red-400 text-white px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 sm:w-full',
      }}
    >
      {/* Incio do Forms */}
      <div className="relative mx-auto w-full px-2 py-2">
        <div className="flex justify-between">
          <div className="relative mx-auto px-2 py-7">
            <div className="mx-auto rounded-lg bg-white p-6">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-sm uppercase leading-normal text-gray-400">
                  Você dejesa Deletar este Membro?{' '}
                  <span className="font-semibold text-gray-600">
                    {memberName}
                  </span>
                </h2>
              </div>

              {/* Botões para submeter Forms */}
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  ref={cancelButtonRef}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-200 hover:px-3 hover:py-2 hover:text-white sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
                {isLoadingSubmitForm ? (
                  <button
                    type="button"
                    disabled={isLoadingSubmitForm}
                    className="flex items-center justify-between rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
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
                    <span>Deletando...</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleDelete(member)}
                    type="submit"
                    className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                  >
                    <span>Deletar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteMember
