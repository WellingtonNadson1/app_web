import { z } from 'zod'

const MembroSchema = z.object({
    id: z.string(),
    first_name: z.string(),
    presencas_cultos: z.object({
        status: z.boolean(),
        cultoIndividualId: z.string(),
        presenca_culto: z.object({
            id: z.string(),
            status: z.string()
        })
    }),
    supervisao_pertence: z.object({
        id: z.string(),
        nome: z.string()
    }),
    celula: z.object({
        id: z.string(),
        nome: z.string()
    })
})

const PresencaCultoSchema = z.object({
    id: z.string(),
    status: z.boolean(),
    membro: MembroSchema
})

export const PresencaForDateSchema = z.object({
    id: z.string(),
    data_inicio_culto: z.string(),
    presencas_culto: PresencaCultoSchema.array(),
    culto_semana: z.object({
        nome: z.string()
    })
})

export type PresencaForDate = z.infer<typeof PresencaForDateSchema>

const MemberDataSchema = z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    presencas_cultos: z.object({
        status: z.boolean(),
        cultoIndividualId: z.string(),
        date_create: z.string(),
        presenca_culto: z.object({
            id: z.string(),
            status: z.string()
        })
    }).array(),
    celula: z.object({
        nome: z.string()
    })
})

export type MemberData = z.infer<typeof MemberDataSchema>


export type GroupedData = Record<string, MemberData[]>;
export type GroupedForCulto = Record<string, PresencaForDate[]>;