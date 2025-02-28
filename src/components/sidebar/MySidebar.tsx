'use client';
import { cn } from '@/lib/utils';
import { useUserDataStore } from '@/store/UserDataStore';
import { SignOut, Spinner, X } from '@phosphor-icons/react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeImage from '../theme-image';
import {
  sidebarCentral,
  sidebarLiderCelula,
  sidebarSupervisor,
  sidebarSupervisorLider,
} from './LinksSidebar';
import Link from 'next/link';

export default function MySidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname().split('/')[1];
  const pathAtual = usePathname();
  console.log('pathName', pathName);
  console.log('pathAtual', pathAtual);
  const { data: session, status } = useSession();
  const { user_roles } = useUserDataStore.getState();

  const handleLogout = () => {
    localStorage.clear();
    signOut();
  };

  useEffect(() => {
    if (
      status === 'authenticated' &&
      (!user_roles || user_roles.length === 0)
    ) {
      handleLogout();
    }
  }, [status, user_roles]);

  // Se o status não for "authenticated", não renderiza os links ainda
  if (status === 'loading') {
    return (
      <div className="p-1 z-50">
        <aside className="flex flex-col rounded-lg border border-sidebar-border h-full shadow-md w-[4.4rem] bg-white p-2 px-3 py-5">
          <div className="mt-7 flex justify-center">
            <Spinner className="animate-spin" />
          </div>
        </aside>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login'); // Redireciona para login se não autenticado
    return null;
  }

  const renderLinks = () => {
    const roles = session?.user?.user_roles;
    if (roles?.some((role) => role.rolenew.name === 'USERCENTRAL')) {
      return sidebarCentral;
    }
    if (
      user_roles?.every((role) =>
        ['USERLIDER', 'USER_FINANCEIRO'].includes(role.rolenew.name),
      ) &&
      !user_roles.every((role) => role.rolenew.name === 'USERSUPERVISOR')
    ) {
      return sidebarLiderCelula;
    }
    if (
      user_roles?.every((role) =>
        ['USERSUPERVISOR', 'USER_FINANCEIRO'].includes(role.rolenew.name),
      )
    ) {
      return sidebarSupervisor;
    }
    if (
      user_roles?.every((role) =>
        ['USERSUPERVISOR', 'USERLIDER'].includes(role.rolenew.name),
      )
    ) {
      return sidebarSupervisorLider;
    }
    return [];
  };

  return (
    <div className="p-1 z-50">
      <aside
        className={`flex flex-col rounded-lg border border-sidebar-border relative h-full shadow-md ${
          open ? 'w-44' : 'w-[4.4rem]'
        } bg-white p-2 px-3 py-5 duration-500 mt-2`}
      >
        <div
          className={cn(
            'p-2',
            !open
              ? 'flex items-center justify-center p-0'
              : 'flex items-center justify-center',
          )}
        >
          <ThemeImage
            alt="Logo IBB"
            srcLight="images/logo-ibb-1.svg"
            srcDark="images/logo-mini-dark.svg"
            onClick={() => router.push(pathAtual)}
            width={54}
            height={54}
          />
        </div>
        <div
          className={`absolute z-50 flex cursor-pointer justify-end rounded-full border-2 border-white bg-[#3e98e1] p-1.5 text-3xl text-white duration-500 hover:rounded-full hover:bg-slate-400/90 hover:fill-white ${
            open
              ? 'ml-[9.3rem] mt-[2.5rem]'
              : 'ml-[2.7rem] rotate-45 mt-[1.2rem]'
          }`}
          onClick={() => setOpen(!open)}
        >
          <X
            className={`${!open ? 'mx-auto' : 'justify-end'} transition-all duration-200`}
            size={14}
          />
        </div>

        <hr className="h-px bg-transparent mt-3 bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />

        <div className="flex flex-col gap-2">
          <ul className="relative flex flex-col pt-4 gap-y-2">
            {renderLinks().map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    `group z-50 flex transform cursor-pointer items-center gap-x-2 rounded-md py-2 pl-2 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:scale-105 hover:bg-[#1D70B6] hover:fill-current hover:text-gray-200 focus:outline-none`,
                    `${pathAtual}` === item.href
                      ? 'bg-[#1D70B6] text-gray-200'
                      : 'text-zinc-400',
                  )}
                >
                  <item.icon
                    className={`${!open ? 'w-screen' : ''}`}
                    width={open ? 24 : 26}
                    height={open ? 24 : 26}
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
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul className="relative flex flex-col pt-4 gap-y-2">
            <hr className="h-px mb-2 -mt-1 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
            <button
              className="group z-50 flex transform cursor-pointer items-center gap-x-2 rounded-md bg-red-400/90 py-2 pl-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out hover:scale-105 hover:bg-red-400 hover:fill-current hover:text-white focus:outline-none"
              onClick={handleLogout}
              type="button"
            >
              <SignOut
                className={`${!open ? 'w-screen' : ''}`}
                size={open ? 24 : 26}
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
        </div>
      </aside>
    </div>
  );
}
