import { z } from 'zod'

const combinedDataSchema = z.array(
  z.union([
    // z.array(
    z.object({
      id: z.string().uuid(),
      nome: z.string(),
      cor: z.string(),
      supervisor: z.object({
        id: z.string().uuid(),
        first_name: z.string(),
        discipulos: z.array(
          z.object({
            user_discipulos: z.object({
              id: z.string().uuid(),
              first_name: z.string(),
            }),
          }),
        ),
      }),
      celulas: z.array(
        z.object({
          id: z.string().uuid(),
          nome: z.string(),
          lider: z.object({
            id: z.string().uuid(),
            first_name: z.string(),
          }),
        }),
      ),
    }),

    // )
    z.array(
      z.object({
        id: z.string().uuid(),
        nome: z.string(),
        descricao: z.string().nullable(),
        userId: z.string().uuid().nullable(),
        date_create: z.string(),
        date_update: z.string(),
      }),
    ),

    z.array(
      z.object({
        id: z.string().uuid(),
        nome: z.string(),
        descricao: z.string().nullable(),
        date_create: z.string(),
        date_update: z.string(),
      }),
    ),

    z.array(
      z.object({
        id: z.string().uuid(),
        nome: z.string(),
        date_create: z.string(),
        date_update: z.string(),
      }),
    ),

    z.array(
      z.object({
        id: z.string().uuid(),
        nome: z.string(),
        date_create: z.string(),
        date_update: z.string(),
      }),
    ),

    z.array(
      z.object({
        almas_ganhas: z.number(),
      }),
    ),
  ]),
)

const schemaDataCombineted = z.object({
  combinedData: combinedDataSchema,
  almasGanhasNoMes: z.number(),
  almasGanhasNoAno: z.number(),
})

export type DataCombineted = z.infer<typeof schemaDataCombineted>
