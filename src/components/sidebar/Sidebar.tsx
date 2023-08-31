'use client'

import { cn } from '@/lib/utils'
import { SignOut, X } from '@phosphor-icons/react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { sidebarCentral, sidebarLiderCelula } from './LinksSidebar'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const route = useRouter()
  const pathName = usePathname().split('/')[1]
  const { data: session, status } = useSession()

  return (
    <div className="shadow">
      <aside
        className={`relative h-full ${
          open ? 'w-48' : 'w-[4.8rem]'
        } bg-white px-4  py-6 duration-500`}
      >
        <Image
          src="/images/logo-ibb-1.svg"
          onClick={() => route.push('/dashboard')}
          width={54}
          height={54}
          alt="logo ibb"
          className={`cursor-pointer ${
            !open ? 'mx-auto' : 'mx-2'
          } transition-all duration-200`}
        />
        <div
          className={`absolute top-[3.8rem] z-50 flex cursor-pointer justify-end rounded-full border border-white bg-[#3e98e1] p-1.5 text-3xl text-white duration-500 hover:rounded-full hover:bg-slate-400/90 hover:fill-white ${
            open ? 'ml-[10.2rem]' : 'ml-[3.04rem] rotate-45'
          } `}
          onClick={() => setOpen(!open)}
        >
          <X
            className={`${
              !open ? 'mx-auto' : 'justify-end'
            } transition-all duration-200`}
            size={14}
          />
        </div>
        <hr className="mt-7 h-px bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
        {status === 'authenticated' ? (
          <ul className="relative flex flex-col gap-y-2 pt-4">
            {session.user.role === 'USERCENTRAL' ? (
              sidebarCentral.map((item) => (
                <li
                  key={item.name}
                  onClick={() => route.push(item.href)}
                  className={cn(
                    `group z-50 flex transform cursor-pointer items-center gap-x-2 rounded-md py-2 pl-2 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:scale-105 hover:bg-[#1D70B6] hover:fill-current hover:text-gray-200 focus:outline-none`,
                    `/${pathName}` === item.href
                      ? 'bg-[#1D70B6] text-gray-200'
                      : 'text-zinc-400',
                  )}
                >
                  <item.icon
                    className={`${!open ? 'w-screen' : ''}`}
                    width={`${open ? 24 : 26}`}
                    height={`${open ? 24 : 26}`}
                  />
                  <span
                    className={`whitespace-pre duration-150 ${
                      !open && 'translate-x-28 overflow-hidden opacity-0'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span
                    className={`${
                      open && 'hidden'
                    } absolute left-12 m-2 w-auto min-w-max origin-left scale-0 rounded-md bg-white p-2 text-xs font-bold text-gray-700 shadow-md transition-all duration-100 group-hover:scale-100`}
                  >
                    {item.name}
                  </span>
                </li>
              ))
            ) : session.user.role === 'USERLIDER' ? (
              sidebarLiderCelula.map((item) => (
                <li
                  key={item.name}
                  onClick={() => route.push(item.href)}
                  className={cn(
                    `group z-50 flex transform cursor-pointer items-center gap-x-2 rounded-md py-2 pl-2 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:scale-105 hover:bg-[#1D70B6] hover:fill-current hover:text-gray-200 focus:outline-none`,
                    `/${pathName}` === item.href
                      ? 'bg-[#1D70B6] text-gray-200'
                      : 'text-zinc-400',
                  )}
                >
                  <item.icon
                    className={`${!open ? 'w-screen' : ''}`}
                    width={`${open ? 24 : 26}`}
                    height={`${open ? 24 : 26}`}
                  />
                  <span
                    className={`whitespace-pre duration-150 ${
                      !open && 'translate-x-28 overflow-hidden opacity-0'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span
                    className={`${
                      open && 'hidden'
                    } absolute left-12 m-2 w-auto min-w-max origin-left scale-0 rounded-md bg-white p-2 text-xs font-bold text-gray-700 shadow-md transition-all duration-100 group-hover:scale-100`}
                  >
                    {item.name}
                  </span>
                </li>
              ))
            ) : (
              <div></div>
            )}
          </ul>
        ) : (
          <svg
            className="mr-3 h-5 w-5 animate-spin text-gray-400"
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
        )}

        {status === 'authenticated' ? (
          <ul className="relative flex flex-col gap-y-2 pt-4">
            <button
              className="focus:outline-none` group z-50 flex transform cursor-pointer items-center gap-x-2 rounded-md bg-red-400/90 py-2 pl-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out hover:scale-105 hover:bg-red-400 hover:fill-current hover:text-white "
              onClick={() => signOut()}
              type="button"
            >
              <SignOut
                className={`${!open ? 'w-screen' : ''}`}
                size={`${open ? 24 : 26}`}
              />
              <span
                className={`whitespace-pre duration-150 ${
                  !open && 'translate-x-28 overflow-hidden opacity-0'
                }`}
              >
                Sair
              </span>
              <span
                className={`${
                  open && 'hidden'
                } absolute left-12 m-2 w-auto min-w-max origin-left scale-0 rounded-md bg-white p-2 text-xs font-bold text-gray-700 shadow-md transition-all duration-100 group-hover:scale-100`}
              >
                Sair
              </span>
            </button>
          </ul>
        ) : (
          <div>carregando...</div>
        )}
      </aside>
    </div>
  )
}
