import { z } from 'zod'

export const celulaSchemaTable = z.object({
  user_discipulos: z.object({
    id: z.string().uuid(),
    first_name: z.string(),
  }),
  supervisor: z.object({
    id: z.string(),
    first_name: z.string(),
    discipulos: z.object({
      user_discipulos: z.object({
        id: z.string(),
        first_name: z.string(),
      })
    }).array()
  })
})

export type TUser = z.infer<typeof celulaSchemaTable>
