'use client'
import ThemeImage from '@/components/theme-image'
// import { GoogleLogo } from '@phosphor-icons/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { Output, email, object, string } from 'valibot'

const loginSchema = object({
  email: string([email()]),
  password: string(),
})

type TypeLogin = Output<typeof loginSchema>

export default function Login() {
  const router = useRouter()
  const { handleSubmit, register } = useForm<TypeLogin>()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingFaield, setIsLoadingFaield] = useState(false)
  const [isLoading504, setIsLoading504] = useState(false)

  const onSubmit: SubmitHandler<TypeLogin> = async ({
    email,
    password,
  }: TypeLogin) => {
    setIsLoading(true)
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (result?.status === 504) {
      setIsLoading504(true)
      setTimeout(() => {
        setIsLoading504(false)
      }, 4000);
    }
    if (result?.error) {
      setIsLoadingFaield(true)
      setIsLoading(false)
      setTimeout(() => {
        setIsLoadingFaield(false)
      }, 4000);
      return
    }
    setIsLoading(false)
    router.replace('/dashboard')
  }

  const onError: SubmitErrorHandler<TypeLogin> = (erros) => console.log(erros)

  return (
    <>
      <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F5F7F9]">
        {/* image */}
        <div className="flex items-center justify-center md:hidden">
          <ThemeImage
            alt="Logo IBB"
            srcLight="images/logo-ibb-1.svg"
            srcDark="images/logo-mini-dark.svg"
            width={54}
            height={54}
          />
        </div>
        {/* Login Container */}
        <div className="flex items-center max-w-3xl p-6 bg-white shadow-lg rounded-2xl">
          <div className="px-6 py-1.5 md:w-1/2">
            <h2 className="mt-4 text-2xl font-bold text-center text-gray-900 md:text-left">
              Seja Bem-vindo!
            </h2>
            <p className="mt-2 text-sm text-gray-900">
              Para logar, entre com seus dados.
            </p>

            {/* form */}
            <div className="mt-8 md:mx-auto md:w-full md:max-w-sm">
              <form
                className="space-y-5"
                onSubmit={handleSubmit(onSubmit, onError)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      {...register('email')}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Digite seu e-mail"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#014874] sm:text-sm sm:leading-7"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Senha
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      {...register('password')}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Digite sua senha"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#014874] sm:text-sm sm:leading-7"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center gap-x-3">
                    <div className="relative flex">
                      <div className="flex items-center h-6">
                        <input
                          id="lembrar"
                          name="lembrar"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#014874] focus:ring-[#014874]"
                        />
                      </div>
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="lembrar"
                        className="font-medium text-gray-900"
                      >
                        Lembrar
                      </label>
                    </div>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-[#014874] hover:text-[#1D70B6]"
                    >
                      Esqueceu a Senha?
                    </a>
                  </div>
                </div>

                <div>
                  {isLoading ? (
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
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
                      <span>Entrando...</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                    >
                      Entrar
                    </button>
                  )}
                  <div className='mx-auto mt-2 text-center'>
                    {isLoadingFaield && <span className="text-sm text-red-400">Senha ou e-mail inválido!</span>}
                  </div>
                  <div className='mx-auto mt-2 text-center'>
                    {isLoading504 && <span className="text-sm text-red-400">Tente novamente!</span>}
                  </div>
                </div>
              </form>

              <hr className='opacity-30" mb-6 mt-8 mx-0 my-4 h-px border-0 bg-transparent bg-gradient-to-r from-transparent via-black/50 to-transparent' />

              {/* <button
                // onClick={() => signIn('google')}
                type="button"
                className="flex w-full items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm ring-1 ring-red-300 duration-100 hover:bg-gray-100/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
              >
                <GoogleLogo color="#f00" size={24} weight="bold" />
                <span className="ml-2 text-sm font-semibold leading-7 text-gray-900">
                  Entrar com Google
                </span>
              </button> */}

              {/* <p className="mt-8 mb-4 text-sm text-center text-gray-500">
                Não tem uma conta?{' '}
                <Link
                  href="#"
                  className="font-semibold leading-6 text-[#014874] hover:text-[#1D70B6]"
                >
                  Cadastre-se
                </Link>
              </p> */}
            </div>
          </div>

          {/* image */}
          <div className="items-center justify-center hidden w-1/2 px-14 md:block">
            <ThemeImage
              alt="Logo IBB"
              srcLight="images/Logo-IBB-Name.svg"
              srcDark="images/logo.svg"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>
    </>
  )
}
