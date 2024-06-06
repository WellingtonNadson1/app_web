import { z } from "zod";

export const InputsFormAuthSchema = z.object({
  useremail: z.string().email({ message: "Endereço de email inválido" }).toLowerCase(),
  password: z.string().min(6, { message: "* Senha requerida" })
})

export type InputsFormAuth = z.infer<typeof InputsFormAuthSchema>
