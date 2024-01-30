'use client'
import Modal from '@/components/modal'
import { useUserDataStore } from '@/store/UserDataStore'
import { UserMinusIcon } from '@heroicons/react/24/outline'
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

  const { token } = useUserDataStore.getState().state

  const router = useRouter()

  const handleDelete = async (memberId: string) => {
    const URLUsers = `https://${hostname}/users/${memberId}`
    setIsLoadingSubmitForm(true)
    const response = await fetch(URLUsers, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
          'z-10 rounded-md bg-red-400 text-white mt-2 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:w-full',
      }}
    >
      {/* Incio do Forms */}
      <div className="relative w-full px-2 py-2 mx-auto">
        <div className="flex justify-between">
          <div className="relative px-2 mx-auto py-7">
            <div className="p-6 mx-auto bg-white rounded-lg">
              <div className="pb-12 border-b border-gray-900/10">
                <h2 className="text-sm leading-normal text-gray-400 uppercase">
                  Você dejesa Deletar este Membro?{' '}
                  <span className="font-semibold text-gray-600">
                    {memberName}
                  </span>
                </h2>
              </div>

              {/* Botões para submeter Forms */}
              <div className="flex items-center justify-end mt-6 gap-x-6">
                <button
                  type="button"
                  ref={cancelButtonRef}
                  className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-300 hover:px-3 hover:py-2 hover:text-gray-900 sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
                {isLoadingSubmitForm ? (
                  <button
                    type="button"
                    disabled={isLoadingSubmitForm}
                    className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-red-700 rounded-md shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-white animate-spin"
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
                    className="px-3 py-2 text-sm font-semibold text-white bg-red-700 rounded-md shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
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
