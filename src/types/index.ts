import { z } from "zod";

export const RoleSchema = z.enum([
  "USERLIDER",
  "USERSUPERVISOR",
  "USERCENTRAL",
  "USERPASTOR",
  "MEMBER",
  "ADMIN",
]);

export const InputsFormAuthSchema = z.object({
  email: z
    .string()
    .email({ message: "Endereço de email inválido" })
    .toLowerCase(),
  password: z.string().min(6, { message: "* Senha requerida" }),
});

export type InputsFormAuth = z.infer<typeof InputsFormAuthSchema>;

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email é necessário" })
    .min(1, "Email é necessário")
    .email("Email inválido"),
  password: z
    .string({ required_error: "Senha é necessária" })
    .min(1, "Senha é necessária")
    .min(8, "Deve possuir no mínimo 8 caracteres")
    .max(32, "Quantidade de caracteres excedido"),
});

export type TypeLogin = z.infer<typeof loginSchema>;

const userSchema = z.object({
  id: z.string(),
  role: z.string(),
  user_roles: z
    .object({
      rolenew: z.object({
        name: z.string(),
      }),
    })
    .array(),
  email: z.string(),
  password: z.string(),
  image_url: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  cpf: z.string(),
  date_nascimento: z.string(),
  sexo: z.string(),
  telefone: z.string(),
  escolaridade: z.string(),
  profissao: z.string(),
  batizado: z.string(),
  date_batizado: z.string(),
  is_discipulado: z.string(),
  discipuladorId: z.string(),
  user: z.object({
    id: z.string(),
    first_name: z.string(),
  }),
  supervisao_pertence: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  celulaId: z.string(),
  estado_civil: z.string(),
  nome_conjuge: z.string(),
  date_casamento: z.string(),
  has_filho: z.string(),
  quantidade_de_filho: z.number(),
  date_decisao: z.string(),
  situacaoNoReinoId: z.string(),
  cargoDeLiderancaId: z.string(),
  token: z.string(),
  refreshToken: z.object({
    id: z.string(),
    expiresIn: z.number(),
    userIdRefresh: z.string(),
  }),
  newRefreshToken: z.object({
    id: z.string(),
    expiresIn: z.number(),
    userIdRefresh: z.string(),
  }),
});
export type TUser = z.infer<typeof userSchema>;
