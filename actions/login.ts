// "use server"

// import { InputsFormAuthSchema } from "@/types";

// type InputsFormAuth = {
//   password: string;
//   useremail: string;
// }

// export const login = async (values: InputsFormAuth) => {
//   const validatedFields = InputsFormAuthSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return { error: "Campo inválido" };
//   }

//   const { useremail, password } = validatedFields.data;

//   const existingUser = await findUserByEmail(useremail);

//   if (!existingUser || !existingUser.email || !existingUser.password) {
//     return { error: "Credenciais Inválidas" };
//   }

//   if (existingUser?.password) {
//     const passwordsMatch = compareSync(
//       password,
//       existingUser.password,
//     )
//     if (!passwordsMatch) {
//       return { error: "Credenciais Inválidas" };
//     }
//   }

//   if (!existingUser.emailVerified) {
//     const verificationToken = await generateVerificationToken(existingUser.email);

//     const email = verificationToken.email
//     const token = verificationToken.token
//     await sendVerificationEmail(
//       existingUser.warName as string,
//       email,
//       token,
//       ''
//     )
//     const errorChange = `Você ainda não confirmou seu E-mail de acesso!
//     Acesse a sua caixa de entrada para confirmar.`
//     return { error: errorChange }
//   }

//   try {
//     const loginSuccess = await signIn("credentials", {
//       useremail,
//       password,
//       redirectTo: DEFAULT_LOGIN_REDIRECT,
//     });
//     return {
//       sucesso: "Sucesso no Login",
//       loginSuccess,
//     };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { error: "Credenciais Inválidas" };
//         default:
//           return { error: "Algo de errado aconteçeu! 🖖🏽" };
//       }
//     }
//     throw error;
//   }
// };
