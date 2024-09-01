import StatusCard from "./statusCards/StatusCard";

// const userNavigation = [
//   { name: 'Meu Perfil', href: '#' },
//   { name: 'Configurações', href: '#' },
//   { name: 'Sair', href: '#' },
// ]

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

export default function MainSide() {
  return (
    <main className="relative z-10 mx-auto w-full py-2">
      {/* <hr className="mt-2 h-px bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" /> */}

      <StatusCard />
    </main>
  );
}
