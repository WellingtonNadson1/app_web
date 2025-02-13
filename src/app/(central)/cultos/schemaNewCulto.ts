import { z } from 'zod'

export const CultoSchema = z.object({
  data_inicio_culto: z.date(),
  data_termino_culto: z.date(),
  status: z.string().optional(),
  presencas_culto: z.string().optional(),
  culto_semana: z.string(),
})

export type NewCulto = z.infer<typeof CultoSchema>

const CultoSemanalSchema = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string(),
  cultoGeral: z.string(),
  cultos: z.string().array().optional(),
})

export type CultoDaSemana = z.infer<typeof CultoSemanalSchema>
