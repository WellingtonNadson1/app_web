'use server';

import { signIn } from '@/auth';
import { InputsFormAuth, InputsFormAuthSchema } from '@/types';
import { AuthError } from 'next-auth';

export const loginFunction = async (values: InputsFormAuth) => {
  const validatedFields = InputsFormAuthSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campo inválido' };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    return {
      sucesso: 'Sucesso no Login',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Credenciais Inválidas' };
        default:
          return { error: 'Algo de errado não está certo! 🖖🏽' };
      }
    }
    throw error;
  }
};
