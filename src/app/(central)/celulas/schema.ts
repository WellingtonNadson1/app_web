import { z } from "zod";

const schemaMember = z.object({
  id: z.string(),
  first_name: z.string(),
  cargo_de_lideranca: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  situacao_no_reino: z.object({
    id: z.string(),
    nome: z.string(),
  })
})

export type Member = z.infer<typeof schemaMember>

const schemaLider = z.object({
  id: z.string(),
  first_name: z.string(),
})

export type Lider = z.infer<typeof schemaLider>

const schemaSupervisao = z.object({
  id: z.string(),
  nome: z.string(),
})

export type Supervisao = z.infer<typeof schemaSupervisao>

const schemaReuniaoCelula = z.object({
  id: z.string(),
  data_reuniao: z.string(),
  status: z.string(),
  presencas_membros_reuniao_celula: z.any().array() // You can replace 'any' with the appropriate type if needed
})

export type ReuniaoCelula = z.infer<typeof schemaReuniaoCelula>

const DataCelula = z.object({
  id: z.string(),
  nome: z.string(),
  membros: z.array(schemaMember),
  lider: schemaLider,
  supervisao: schemaSupervisao,
  date_que_ocorre: z.string(),
  reunioes_celula: z.array(schemaReuniaoCelula)
})

const schemaFormCelula = z.object({
  nome: z.string(),
  lider: z.object({
    id: z.string().uuid(),
    first_name: z.string(),
  }),
  supervisao: z.object({
    id: z.string().uuid(),
    nome: z.string(),
  }),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  bairro: z.string(),
  endereco: z.string(),
  numero_casa: z.string(),
  date_inicio: z.string().datetime(),
  date_multipicar: z.string().datetime(),
  date_que_ocorre: z.string().datetime(),
  membros: z.object({
    id: z.string().uuid(),
    first_name: z.string(),
  }).array(),
})

export type FormCelula = z.infer<typeof schemaFormCelula>

const schemaCelula = z.object({
  id: z.string(),
  nome: z.string(),
  lider: z.object({
    id: z.string(),
    first_name: z.string(),
  })
})

export type Celula = z.infer<typeof schemaCelula>

const schemaUser = z.object({
  id: z.string(),
  first_name: z.string().optional(),
  cargo_de_lideranca: z.object({
    id: z.string(),
    nome: z.string()
  }),
  situacao_no_reino: z.object({
    id: z.string(),
    nome: z.string()
  })
})

export type User = z.infer<typeof schemaUser>

const SchemaSupervisaoData = z.object({
  id: z.string(),
  nome: z.string(),
  membros: z.array(schemaUser),
  celulas: z.array(schemaCelula)
})

export type SupervisaoData = z.infer<typeof SchemaSupervisaoData>

