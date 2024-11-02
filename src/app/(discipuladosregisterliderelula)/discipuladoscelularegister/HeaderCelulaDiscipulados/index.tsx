'use client'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import { UserCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { Fragment } from 'react'
// import { signIn } from 'next-auth/react'
// import Image from 'next/image'

const userNavigation = [
  { name: 'Meu Perfil', href: '#' },
  { name: 'Configurações', href: '#' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface HeaderCelulaProps {
  headerCelula: string | undefined
}

export default function HeaderCelulaDiscipulados({
  headerCelula,
}: HeaderCelulaProps) {
  const { data: session, status } = useSession()

  const toDay = format(new Date(), 'PP', { locale: pt })

  if (status === 'loading') {
    return <SpinnerButton message={''} />
  }

  const isAuthenticated = status === 'authenticated'

  if (!isAuthenticated) {
    return (
      <nav className="relative flex items-center justify-between p-1 mx-1  mt-1 mb-6 bg-white rounded-full shadow-none">
        <h2>Deu não autenticado!</h2>
      </nav>
    )
  }

  return (
    <>
      <nav className="relative flex items-center justify-between p-1 mx-1  mt-1 mb-6 bg-white rounded-full shadow-none">
        <div className="flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Titile Page */}
          {session ? (
            <h1 className="px-3 text-xl font-semibold leading-relaxed text-gray-800">
              Célula {headerCelula}
            </h1>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 mr-3 text-gray-400 animate-spin"
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
        </div>
        <div className="flex items-center justify-end w-1/2 gap-2 sm:w-1/2 sm:gap-8">
          {/* {session?.user ? ( */}
          <>
            <div>
              <h2 className="hidden text-xs text-gray-700 truncate sm:block">
                Shalom,{' '}
                <span className="font-bold">{session?.user?.first_name}</span>
              </h2>
              <p className="hidden text-xs text-gray-700 sm:block">{toDay}</p>
            </div>
            <div className="cursor-pointer">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="relative p-1 text-gray-400 bg-white rounded-full hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="relative -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="w-6 h-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative z-20">
                  <div>
                    <Menu.Button className="relative flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
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
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-20 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700',
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                      <Menu.Item>
                        <button
                          className="block w-full px-4 py-2 text-sm text-gray-700 bg-white text-start hover:bg-gray-100"
                          onClick={() => signOut()}
                        >
                          Sair
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </>
        </div>
      </nav>
    </>
  )
}
