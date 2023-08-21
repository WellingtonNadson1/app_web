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
            {`${NamePage} ${celula?.nome}`}
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
