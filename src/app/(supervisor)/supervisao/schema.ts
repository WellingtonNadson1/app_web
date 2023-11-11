import { z } from 'zod'

const MeetingSchema = z.object({
  data: z.array(
    z.object({
    id: z.string(),
    culto_semana: z.object({
      nome: z.string(),
    }),
    imageUrl: z.string(),
    data_inicio_culto: z.string(),
    data_termino_culto: z.string(),
  })
)
})

export type Meeting = z.infer<typeof MeetingSchema>

const ReuniaoCelulaSchema = z.object({
  id: z.string(),
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_reuniao_celula: z.object({}).array(),
})

const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  situacao_no_reino: z.object({
    nome: z.string(),
  }),
  cargo_de_lideranca: z.object({
    nome: z.string(),
  }),
})

const CelulaSchema = z.object({
  data: z.object({
  id: z.string(),
  nome: z.string(),
  lider: z.object({
    first_name: z.string(),
    id: z.string(),
  }),
  supervisao: z.string(),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  bairro: z.string(),
  endereco: z.string(),
  numero_casa: z.string(),
  date_inicio: z.string().datetime(),
  date_que_ocorre: z.string().datetime(),
  date_multipicar: z.string().datetime(),
  supervisaoId: z.string(),
  membros: z.array(UserSchema),
  reunioes_celula: z.array(ReuniaoCelulaSchema),
  userId: z.string(),
})
})

export type CelulaProps = z.infer<typeof CelulaSchema>
