import { z } from 'zod'

export const FormSchema = z.object({
  presence_culto: z.string(),
  membro: z.array(
    z.object({
      id: z.string(),
      status: z.enum(['true', 'false'], {
        required_error: 'Selecione',
      }),
    }),
  ),
})

export type dataForms = z.infer<typeof FormSchema>
