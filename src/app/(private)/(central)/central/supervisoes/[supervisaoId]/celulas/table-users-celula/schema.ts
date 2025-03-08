import { z } from 'zod';

const discipuladorUsuarioSchema = z.object({
  user_discipulador: z.object({
    id: z.string().uuid(),
    first_name: z.string(),
  }),
});

const supervisaoPertenceSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const celulaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const situacaoNoReinoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const cargoDeLiderancaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

export const escolaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const encontroSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

export const userSchemaTable = z.object({
  id: z.string().uuid(),
  role: z.string(),
  discipulador: z.array(discipuladorUsuarioSchema).optional(),
  discipulos: z.array(z.unknown()).optional(),
  user_roles: z
    .object({
      rolenew: z.object({
        name: z.string(),
      }),
    })
    .array(),
  image_url: z.string().optional(),
  email: z.string().email('Email inválido'),
  first_name: z.string().min(1, 'Nome é obrigatório'),
  last_name: z.string().min(1, 'Sobrenome é obrigatório'),
  date_nascimento: z.date().optional(),
  sexo: z.enum(['M', 'F'], { required_error: 'Sexo é obrigatório' }),
  cpf: z.string().optional(),
  telefone: z.string().min(10, 'Telefone inválido'),
  escolaridade: z.enum([
    'sem_escolaridade',
    'fundamental_incompleto',
    'fundamental_completo',
    'medio_incompleto',
    'medio_completo',
    'superior_incompleto',
    'superior_completo',
    'pos_graduado',
    'mestre',
    'doutor',
  ]),
  profissao: z.string().optional(),
  batizado: z.boolean(),
  date_batizado: z.date().optional(),
  is_discipulado: z.boolean(),
  estado_civil: z.enum(
    ['solteiro', 'casado', 'divorciado', 'uniao_estavel', 'viuvo'],
    { required_error: 'Estado Civil é obrigatório' },
  ),
  nome_conjuge: z.string().optional(),
  date_casamento: z.date().optional(),
  has_filho: z.boolean(),
  quantidade_de_filho: z.number().optional(),
  discipuladorId: z.string().uuid(),
  supervisao_pertence: supervisaoPertenceSchema,
  celula: celulaSchema,
  celula_lidera: z.array(z.unknown()),
  situacao_no_reino: situacaoNoReinoSchema,
  cargo_de_lideranca: cargoDeLiderancaSchema,
  escolas: z.array(escolaSchema),
  encontros: z.array(encontroSchema),
  presencas_aulas_escolas: z.array(z.unknown()),
  cep: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  bairro: z.string().optional(),
  endereco: z.string().optional(),
  numero_casa: z.string().optional(),
});

export type TUser = z.infer<typeof userSchemaTable>;
