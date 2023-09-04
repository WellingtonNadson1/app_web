'use client'

import { Menu, Transition } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import { UserCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
// import Image from 'next/image'
const userNavigation = [
  { name: 'Meu Perfil', href: '#' },
  { name: 'Configurações', href: '#' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  const { data: session, status } = useSession()

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
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                        <button onClick={() => signOut}>Sair</button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
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
