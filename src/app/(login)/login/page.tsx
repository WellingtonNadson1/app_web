'use client'
import { FormError } from '@/components/Info/form-error'
import { FormSuccess } from '@/components/Info/form-sucesso'
import ThemeImage from '@/components/theme-image'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TypeLogin } from '@/types'
import { Spinner } from '@phosphor-icons/react/dist/ssr'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { loginFunction } from '../../../../actions/login'

export default function Login() {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const { handleSubmit, register } = useForm<TypeLogin>()

  const loginFn = async ({ email, password }: TypeLogin) => {
    const registered = await loginFunction({
      email,
      password,
    })
    return registered
  }

  const { mutateAsync: loginFunc, isPending } = useMutation({
    mutationKey: ['registeruser'],
    mutationFn: loginFn,
  })

  const onSubmit: SubmitHandler<TypeLogin> = async ({ email, password }) => {
    setError('')
    setSuccess('')
    try {
      const login: any = await loginFunc({ email, password }).then((data) => {
        setError(data?.error)
        setSuccess(data?.sucesso)
        console.log('login', login)
        return login
      })
    } catch (error) {
      console.error(error)
    }
  }

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
        <Card>
          <div className="flex items-center max-w-3xl p-6 bg-white shadow-lg rounded-2xl">
            <div className="md:w-1/2">
              <CardHeader>
                <CardTitle className="text-xl">Seja Bem-vindo!</CardTitle>
                <CardDescription>
                  Para logar, entre com seus dados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="md:mx-auto md:w-full md:max-w-sm">
                  <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="mt-2">
                        <Input
                          {...register('email')}
                          id="email"
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
                        <Label htmlFor="password">Senha</Label>
                      </div>
                      <div className="mt-2">
                        <Input
                          {...register('password')}
                          id="password"
                          type="password"
                          autoComplete="current-password"
                          placeholder="Digite sua senha"
                          required
                          className="block w-full mb-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#014874] sm:text-sm sm:leading-7"
                        />
                      </div>
                    </div>

                    {/* <div className="flex items-center justify-between">
                      <div className="flex items-center justify-center gap-x-3">
                        <div className="relative flex">
                          <div className="flex items-center h-6">
                            <Input
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
                    </div> */}

                    <div>
                      {isPending ? (
                        <Button
                          type="submit"
                          disabled
                          className="mt-2 flex w-full items-center justify-center gap-2 bg-btnIbb px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                        >
                          <Spinner className="animate-spin" />
                          <span>Entrando...</span>
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="mt-2 flex w-full justify-center rounded-md bg-btnIbb px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                        >
                          Entrar
                        </Button>
                      )}
                      <FormSuccess message={success} />
                      <FormError message={error} />
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
              </CardContent>
              {/* form */}
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
        </Card>
      </section>
    </>
  )
}
