'use client'
import { Popover, Transition } from '@headlessui/react'
import {
  ArrowLeftOnRectangleIcon,
  ChartPieIcon,
  FingerPrintIcon,
} from '@heroicons/react/24/outline'
import { UserCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment } from 'react'
// import { signIn } from 'next-auth/react'
// import Image from 'next/image'

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const solutions = [
    {
      name: 'Análise',
      description: 'Acompanhe o desempenho da sua célula',
      href: '#',
      icon: ChartPieIcon,
    },
    {
      name: 'Configurações',
      description: 'Configurações do seu Perfil',
      href: router.push('/perfil-membro'),
      icon: FingerPrintIcon,
    },
    {
      name: 'Sair',
      description: 'Sair do App',
      href: signOut(),
      icon: ArrowLeftOnRectangleIcon,
    },
  ]

  const toDay = format(new Date(), 'PP', { locale: pt })

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
      <nav className="relative mx-2 mt-3 flex items-center justify-between rounded-full bg-white p-1 shadow-none">
        <h2>Deu não autenticado!</h2>
      </nav>
    )
  }

  return (
    <>
      <nav className="relative mx-2 mt-3 flex items-center justify-between rounded-full bg-white p-1 shadow-none">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between">
          {/* Titile Page */}
          <h1 className="px-3 text-xl font-semibold leading-relaxed text-gray-800">
            {NamePage}
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
            {/* <div className="h-10  w-10 cursor-pointer rounded-full bg-gray-50 hover:ring-1 hover:ring-blue-400">
              {session?.user?.image_url ? (
                <Image
                  src={session?.user?.image_url}
                  width={58}
                  height={58}
                  alt="Wellington"
                  className={`rounded-full shadow`}
                />
              ) : (
                <UserCircle
                  size={32}
                  width={40}
                  height={40}
                  weight="thin"
                  className={`rounded-full text-zinc-500 shadow`}
                />
              )}
            </div> */}
            <div className="h-10  w-10 cursor-pointer rounded-full bg-gray-50 hover:ring-1 hover:ring-blue-400">
              <Popover className="relative">
                <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                  {session?.user?.image_url ? (
                    <Image
                      src={session?.user?.image_url}
                      width={58}
                      height={58}
                      alt="Wellington"
                      className={`rounded-full shadow`}
                    />
                  ) : (
                    <UserCircle
                      size={32}
                      width={40}
                      height={40}
                      weight="thin"
                      className={`rounded-full text-zinc-500 shadow`}
                    />
                  )}
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                    <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                      <div className="p-4">
                        {solutions.map((item) => (
                          <div
                            key={item.name}
                            className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
                          >
                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                              <item.icon
                                className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                                aria-hidden="true"
                              />
                            </div>
                            <div>
                              <button
                                onClick={() => item.href}
                                className="font-semibold text-gray-900"
                              >
                                {item.name}
                                <span className="absolute inset-0" />
                              </button>
                              <p className="mt-1 text-gray-600">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
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
