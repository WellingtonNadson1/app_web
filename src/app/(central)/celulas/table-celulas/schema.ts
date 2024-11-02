import { z } from 'zod'

export const celulaSchemaTable = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  date_que_ocorre: z.string(),
  lider: z.object({
    first_name: z.string(),
    id: z.string().uuid(),
  }),
  membros: z
    .object({
      first_name: z.string(),
      id: z.string().uuid(),
    })
    .array(),
  supervisao: z.object({
    nome: z.string(),
    id: z.string().uuid(),
  }),
})

export type TUser = z.infer<typeof celulaSchemaTable>
