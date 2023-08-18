import { z } from 'zod'

export const MemberSchema = z.object({
  supervisao_pertence: z.string().optional(),
  celula: z.string().optional(),
  image_url: z.string().optional(),
  escolas: z.string().array().optional(),
  encontros: z.string().array().optional(),
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  cpf: z.string().optional(),
  date_nascimento: z.string().datetime(),
  sexo: z.string(),
  telefone: z.string(),
  escolaridade: z.string(),
  profissao: z.string().optional(),
  batizado: z.boolean(),
  date_batizado: z.string().datetime().optional(),
  is_discipulado: z.boolean(),
  discipulador: z.string().optional(),
  estado_civil: z.string(),
  nome_conjuge: z.string().optional(),
  date_casamento: z.string().datetime().optional(),
  has_filho: z.boolean(),
  quantidade_de_filho: z.number().optional(),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  bairro: z.string(),
  endereco: z.string(),
  numero_casa: z.string(),
  date_decisao: z.string().datetime().optional(),
  situacao_no_reino: z.string().optional(),
  cargo_de_lideranca: z.string().optional(),
  celula_lidera: z.string().array().optional(),
  escola_lidera: z.string().array().optional(),
  supervisoes_lidera: z.string().array().optional(),
  presencas_aulas_escolas: z.string().array().optional(),
  presencas_cultos: z.string().array().optional(),
  TurmaEscola: z.string().optional(),
  token: z.string(),
})

export type Member = z.infer<typeof MemberSchema>

export type AddressProps = {
  uf: string
  bairro: string
  logradouro: string
  complemento: string
  localidade: string
}

interface Celula {
  id: string
  nome: string
}

export interface SupervisaoData {
  id: string
  nome: string
  celulas: Celula[]
}

const EscolasSchema = z
  .object({
    id: z.string(),
    nome: z.string(),
  })
  .array()

export type Escolas = z.infer<typeof EscolasSchema>

const EncontrosSchema = z
  .object({
    id: z.string(),
    nome: z.string(),
  })
  .array()

export type Encontros = z.infer<typeof EncontrosSchema>

const SituacoesNoReinoSchema = z
  .object({
    id: z.string(),
    nome: z.string(),
  })
  .array()

export type SituacoesNoReino = z.infer<typeof SituacoesNoReinoSchema>

export interface FetchError extends Error {
  status?: number
}
