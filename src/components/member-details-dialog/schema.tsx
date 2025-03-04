import { z } from 'zod';

export const MemberSchema = z.object({
  id: z.string(),
  role: z.string(),
  discipulador: z
    .object({
      user_discipulador: z.object({
        id: z.string(),
        first_name: z.string(),
      }),
    })
    .array(),
  discipulos: z
    .object({
      user_discipulos: z.object({
        id: z.string(),
        first_name: z.string(),
      }),
    })
    .array(),
  image_url: z.string().optional(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  date_nascimento: z.string().datetime(),
  sexo: z.string(),
  supervisao_pertence: z
    .object({
      id: z.string(),
      nome: z.string(),
    })
    .optional(),
  celula: z
    .object({
      id: z.string(),
      nome: z.string(),
    })
    .optional(),
  escolas: z
    .object({
      id: z.string(),
      nome: z.string(),
    })
    .array()
    .optional(),
  encontros: z
    .object({
      id: z.string(),
      nome: z.string(),
    })
    .array()
    .optional(),
  password: z.string(),
  cpf: z.string().optional(),
  telefone: z.string(),
  escolaridade: z.string(),
  profissao: z.string().optional(),
  batizado: z.boolean(),
  date_batizado: z.string().datetime().optional(),
  is_discipulado: z.boolean(),
  user: z.object({
    id: z.string(),
    first_name: z.string(),
  }),
  discipuladorId: z.string().optional(),
  estado_civil: z.string(),
  nome_conjuge: z.string().optional(),
  date_casamento: z.string().datetime().optional(),
  has_filho: z.boolean(),
  quantidade_de_filho: z.number().optional(),
  cep: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  bairro: z.string().optional(),
  endereco: z.string().optional(),
  numero_casa: z.string().optional(),
  date_decisao: z.string().datetime().optional(),
  situacao_no_reino: z
    .object({
      id: z.string(),
      nome: z.string(),
    })
    .optional(),
  cargo_de_lideranca: z
    .object({
      id: z.string(),
      nome: z.string(),
    })
    .optional(),
  celula_lidera: z
    .object({
      id: z.string(),
      nome: z.string(),
    })
    .optional(),
  escola_lidera: z.string().array().optional(),
  supervisoes_lidera: z.string().array().optional(),
  presencas_aulas_escolas: z.string().array().optional(),
  presencas_cultos: z.string().array().optional(),
  TurmaEscola: z.string().optional(),
  token: z.string(),
});

export type Member = z.infer<typeof MemberSchema>;
