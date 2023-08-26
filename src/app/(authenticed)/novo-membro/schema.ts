import { z } from 'zod'

export const MemberSchema = z.object({
  id: z.string(),
  role: z.string(),
  image_url: z.string().optional(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  date_nascimento: z.string().datetime(),
  sexo: z.string(),
  supervisao_pertence: z.string().optional(),
  celula: z.string().optional(),
  escolas: z.union([z.string().array().optional(), z.null()]),
  encontros: z.union([z.string().array().optional(), z.null()]),
  password: z.string(),
  cpf: z.string().optional(),
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
  celula_lidera: z.string().optional(),
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

export interface ReturnMembers {
  id: string
  role: string
  image_url: string | null
  email: string
  first_name: string
  last_name: string
  date_nascimento: string
  sexo: string
  telefone: string | null
  escolaridade: string
  profissao: string | null
  batizado: boolean
  date_batizado: string | null
  is_discipulado: boolean
  discipulador: string | null
  estado_civil: string
  nome_conjuge: string | null
  date_casamento: string
  has_filho: boolean
  quantidade_de_filho: number | null
  date_decisao: string | null
  supervisao_pertence: {
    nome: string
  }
  celula: {
    nome: string
  }
  celula_lidera: Array<{
    nome: string
  }>
  situacao_no_reino: {
    nome: string
  }
  cargo_de_lideranca: {
    nome: string
  }
  escolas: any[] // Update this to the correct type if you have one
  encontros: any[] // Update this to the correct type if you have one
  presencas_aulas_escolas: any[] // Update this to the correct type if you have one
  presencas_cultos: Array<{
    id: string
    status: boolean
    userId: string
    cultoIndividualId: string
  }>
}
