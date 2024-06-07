"use server";

import { AuthError } from "next-auth";
import { InputsFormAuth, InputsFormAuthSchema } from "@/types";
import { signIn } from "@/auth";

export const loginFunction = async (values: InputsFormAuth) => {
  const validatedFields = InputsFormAuthSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campo inválido" };
  }

  const { email, password } = validatedFields.data;

  try {
    const loginSuccess = await signIn("credentials", {
      email,
      password,
      // redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return {
      sucesso: "Sucesso no Login",
      loginSuccess,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciais Inválidas" };
        default:
          return { error: "Algo de errado não está certo! 🖖🏽" };
      }
    }
    throw error;
  }
};
