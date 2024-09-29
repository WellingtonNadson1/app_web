import { z } from 'zod';

const presencaCultoSchema = z.object({
  id: z.string().uuid(),
  status: z.boolean(),
  userId: z.string().uuid(),
  cultoIndividualId: z.string().uuid(),
  date_create: z.string().datetime(),
  date_update: z.string().datetime(),
});

const discipuladorSchema = z.object({
  user_discipulador: z.object({
    id: z.string().uuid(),
    first_name: z.string(),
  }),
});

const discipuloSchema = z.object({
  user_discipulos: z.object({
    id: z.string().uuid(),
    first_name: z.string(),
  }),
});

const cargoDeLiderancaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const situacaoNoReinoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const userSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
});

const membroSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  presencas_cultos: z.array(presencaCultoSchema).optional(),
  discipulador: z.array(discipuladorSchema),
  discipulos: z.array(discipuloSchema),
  cargo_de_lideranca: cargoDeLiderancaSchema,
  situacao_no_reino: situacaoNoReinoSchema,
  user: userSchema,
});

const liderSchema = z.object({
  id: z.string().uuid(),
});

const supervisaoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

export const dataSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  membros: z.array(membroSchema),
  lider: liderSchema,
  supervisao: supervisaoSchema,
  date_que_ocorre: z.string(),
  date_inicio: z.string().datetime(),
  date_multipicar: z.string().datetime(),
  reunioes_celula: z.array(z.unknown()),
});
