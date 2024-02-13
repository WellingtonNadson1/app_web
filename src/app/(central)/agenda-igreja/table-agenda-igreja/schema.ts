import { z } from 'zod'

export const temaSchemaTable = z.object({
  tema: z.string(),
  versiculo_chave: z.string(),
  date: z.object({
    from: z.string(),
    to: z.string(),
  }),
})

export type TUser = z.infer<typeof temaSchemaTable>

export const allAgendaReturnSchemaTable = z.object({
  id: z.string().uuid(),
  status: z.boolean(),
  title: z.string(),
  description: z.string(),
  data_inicio: z.string(),
  data_termino: z.string(),
})

export type AllAgendaReturn = z.infer<typeof allAgendaReturnSchemaTable>
