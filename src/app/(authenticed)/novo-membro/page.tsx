'use client'
import ListMembers from '@/components/listMembers'
import useSWR from 'swr'
import { ReturnMembers } from './schema'
import { useSession } from 'next-auth/react'
import { fetchWithToken } from '@/functions/functions'
import SpinnerButton from '@/components/spinners/SpinnerButton'


export default function NovoMembro() {
  const { data: session } = useSession()
  
  const hostname = 'app-ibb.onrender.com'
  const URL = `https://${hostname}/users`

  const {
    data: members,
    error,
    isValidating,
    isLoading,
  } = useSWR<ReturnMembers[]>(
    [URL, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
  )

  if (error) {
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto w-full">
          <div>
            Falha ao carregar, por favor, saia e entre no App novamente.
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto flex w-full items-center gap-2">
          <div className="flex items-center gap-3 text-white">
            <SpinnerButton />
          </div>
        </div>
      </div>
    )
  }

  if (isValidating) {
    console.log('Is Validating', isValidating)
  }

  return (
    <>
      <div className="relative mx-auto mb-4 mt-4 w-full px-2">
        {members && 
          <ListMembers members={members}  />
        }
      </div>
    </>
  )
}
