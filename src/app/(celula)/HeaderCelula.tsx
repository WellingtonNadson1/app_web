'use client'
import { fetchWithToken } from '@/functions/functions'
import { UserCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { hostname } from 'os'
import useSWR from 'swr'
// import { signIn } from 'next-auth/react'
// import Image from 'next/image'
interface Celula {
  id: string
  nome: string
  lider: {
    id: string
    first_name: string
  }
}

export default function HeaderCelula() {
  const { data: session, status } = useSession()
  const URLCelula = `https://${hostname}/celulas/${session?.user.celulaId}`

  const toDay = format(new Date(), 'PP', { locale: pt })

  const { data: celula } = useSWR<Celula>(
    [URLCelula, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )

  const pathName = usePathname().split('/')[1]
  function captitalizeTheFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  const NamePage = captitalizeTheFirstLetter(pathName)

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  const isAuthenticated = status === 'authenticated'

  if (!isAuthenticated) {
    return (
      <nav className="relative z-10 mx-2 mt-3 flex items-center justify-between rounded-full bg-white p-1 shadow-none">
        <h2>Deu não autenticado!</h2>
      </nav>
    )
  }

  return (
    <>
      <nav className="relative z-10 mx-2 mt-3 flex items-center justify-between rounded-full bg-white p-1 shadow-none">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between">
          {/* Titile Page */}
          <h1 className="px-3 text-xl font-semibold leading-relaxed text-gray-800">
            {celula ? (
              `${NamePage} ${celula?.nome}`
            ) : (
              <div className="flex items-center justify-center gap-2">
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
                carregando...
              </div>
            )}
          </h1>
        </div>
        <div className="flex w-1/2 items-center justify-end gap-2 sm:w-1/2 sm:gap-8">
          {/* {session?.user ? ( */}
          <>
            <div>
              <h2 className="hidden text-xs text-gray-700 sm:block">
                Shalom,{' '}
                <span className="font-bold">{session?.user?.first_name}</span>
              </h2>
              <p className="hidden text-xs text-gray-700 sm:block">{toDay}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-50">
              {session?.user?.image_url ? (
                <Image
                  src={session?.user?.image_url}
                  width={58}
                  height={58}
                  alt="Wellington"
                  className={`cursor-pointer rounded-full shadow`}
                />
              ) : (
                <UserCircle
                  size={32}
                  width={40}
                  height={40}
                  weight="thin"
                  className={`cursor-pointer rounded-full text-zinc-500 shadow`}
                />
              )}
            </div>
          </>
          {/* ) : (
            <button className="text-red-400" onClick={() => signIn()}>
              {' '}
              Sign In
            </button>
          )} */}
        </div>
      </nav>
    </>
  )
}
