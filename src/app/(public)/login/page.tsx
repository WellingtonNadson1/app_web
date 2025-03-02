'use client';

import { Eye, EyeClosed, Spinner } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { memo, useCallback, useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { FormError } from '@/components/Info/form-error';
import { FormSuccess } from '@/components/Info/form-sucesso';
import ThemeImage from '@/components/theme-image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TypeLogin } from '@/types';
import { loginFunction } from '../../../../actions/login';

const MobileLogoHeader = memo(function MobileLogoHeader() {
  return (
    <div className="flex items-center justify-center md:hidden py-2">
      <ThemeImage
        alt="Logo IBB"
        srcLight="/apple-touch-icon.png"
        srcDark="/apple-touch-icon.png"
        width={54}
        height={54}
      />
    </div>
  );
});

const DesktopLogo = memo(function DesktopLogo() {
  return (
    <div className="hidden md:block mx-auto px-16 items-center justify-center w-full">
      <ThemeImage
        alt="Logo IBB"
        srcLight="/images/logo-ibb-ligth.png"
        srcDark="/images/logo-ibb-dark.png"
        width={300}
        height={300}
      />
    </div>
  );
});

export default function Login() {
  const [status, setStatus] = useState<{ error?: string; success?: string }>(
    {},
  );
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, register } = useForm<TypeLogin>();

  const { mutateAsync: loginFunc, isPending } = useMutation({
    mutationKey: ['loginuser'],
    mutationFn: loginFunction,
    onSuccess: (data) => {
      setStatus({ error: data?.error, success: data?.sucesso });
    },
    onError: ({ message }) => {
      console.log('error message:', message);
      setStatus({ error: 'Acesso não autorizado!' });
      localStorage.clear();
    },
  });

  const onSubmit: SubmitHandler<TypeLogin> = useCallback(
    async (data) => {
      setStatus({ error: '', success: '' });
      const response = await loginFunc(data);

      if (response?.sucesso) {
        window.location.href = '/central/dashboard'; // Redireciona após sucesso
      }
    },
    [loginFunc],
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const memoizedCard = useMemo(
    () => (
      <Card className="w-full min-w-max px-8 py-6">
        <div className="flex items-center justify-center bg-white ">
          <div className="flex flex-col bg-white w-full rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Seja Bem-vindo(a)!</CardTitle>
              <CardDescription>
                Para logar, entre com seus dados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="md:w-full md:max-w-sm">
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
                    <div className="mt-2 relative">
                      <Input
                        {...register('password')}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Digite sua senha"
                        required
                        className="block w-full mb-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#014874] sm:text-sm sm:leading-7"
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <Eye color="#6b7280" size={20} />
                        ) : (
                          <EyeClosed color="#9ca3af" size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="mt-2 flex w-full justify-center rounded-md bg-btnIbb px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                    >
                      {isPending ? (
                        <>
                          <Spinner className="animate-spin" />
                          <span>Entrando...</span>
                        </>
                      ) : (
                        <span>Entrar</span>
                      )}
                    </Button>
                    {status.success && <FormSuccess message={status.success} />}
                    {status.error && <FormError message={status.error} />}
                  </div>
                </form>

                <hr className="opacity-30 mt-8 mx-0 my-4 h-px border-0 bg-transparent bg-gradient-to-r from-transparent via-black/50 to-transparent" />
              </div>
            </CardContent>
          </div>
          <DesktopLogo />
        </div>
      </Card>
    ),
    [
      handleSubmit,
      onSubmit,
      register,
      showPassword,
      togglePasswordVisibility,
      isPending,
      status,
    ],
  );

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <MobileLogoHeader />
        {memoizedCard}
      </div>
    </section>
  );
}
