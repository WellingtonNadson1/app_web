import { z } from 'zod'

const MeetingSchema = z
  .object({
    id: z.string(),
    culto_semana: z.object({
      nome: z.string(),
    }),
    imageUrl: z.string(),
    data_inicio_culto: z.string(),
    data_termino_culto: z.string(),
  })
  .array()

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
  presencas_cultos: z
    .object({
      id: z.string(),
      status: z.boolean(),
      userId: z.string(),
      cultoIndividualId: z.string(),
      date_create: z.date(),
      date_update: z.date(),
    })
    .array(),
})

export const CelulaSchema = z.object({
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

export type CelulaProps = z.infer<typeof CelulaSchema>

const PresencaCultoCelulaSchema = z.object({
  id: z.string(),
  status: z.boolean(),
  membro: z.string(),
  presenca_culto: z.string(),
})

export type PresencaCultoProps = z.infer<typeof PresencaCultoCelulaSchema>

const attendanceSchema = z.object({
  status: z.string(),
  membro: z.string(),
  presenca_culto: z.string(),
})

export type attendance = z.infer<typeof attendanceSchema>

export type ReuniaoCelulaSuccessData = {
  status: string
  celula: string
  data_reuniao: string
  presencas_membros_reuniao_celula: string
  id?: string | undefined
  visitantes: number
  almas_ganhas: number
}

export const reuniaoCelulaUpdateSchema = z.object({
  id: z.string().optional(),
  visitantes: z.number().int().positive(),
  almas_ganhas: z.number().int().positive(),
})

export type reuniaoCelulaUpdate = z.infer<typeof reuniaoCelulaUpdateSchema>

export const reuniaoCelulaUpdateSchemaReturn = z.object({
  id: z.string().optional(),
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: z.string(),
  visitantes: z.number().int().positive(),
  almas_ganhas: z.number().int().positive(),
})

export type reuniaoCelulaUpdateReturn = z.infer<
  typeof reuniaoCelulaUpdateSchemaReturn
>

const reuniaoCelulaDataSchema = z.object({
  id: z.string().optional(),
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: z.string(),
  visitantes: z.number().int().positive(),
  almas_ganhas: z.number().int().positive(),
})

export type reuniaoCelulaData = z.infer<typeof reuniaoCelulaDataSchema>

const reuniaoCelulaDataSchema2 = z.object({
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: z.string().nullable(),
})

export type reuniaoCelulaData2 = z.infer<typeof reuniaoCelulaDataSchema2>

export const attendanceReuniaCelulaSchema = z.object({
  which_reuniao_celula: z.string(),
  membro: z.array(
    z.object({
      id: z.string(),
      status: z.string(), // Alterado para aceitar boolean
    })
  ),
});

export type attendanceReuniaoCelula = z.infer<
  typeof attendanceReuniaCelulaSchema
>;

export const CelulaSortSchema = z.array(
  z.object({
    id: z.string(),
    first_name: z.string(),
    situacao_no_reino: z.object({
      nome: z.string(),
    }),
    cargo_de_lideranca: z.object({
      nome: z.string(),
    }),
    presencas_cultos: z.array(
      z.object({
        id: z.string(),
        status: z.boolean(),
        userId: z.string(),
        cultoIndividualId: z.string(),
        date_create: z.date(),
        date_update: z.date(),
      })
    ),
  })
);

// Exemplo de uso
export type CelulaSort = z.infer<typeof CelulaSortSchema>;


// Schema para "id" e "nome"
const idAndNameSchema = z.object({
  id: z.string().uuid(), // IDs são UUIDs baseado no exemplo
  nome: z.string(),
});

// Schema para "id" e "first_name"
const idAndFirstNameSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
});

// Schema para "presencas_cultos"
const presencaCultoSchema = z.object({
  id: z.string().uuid(),
  status: z.boolean(),
  userId: z.string().uuid(),
  cultoIndividualId: z.string().uuid(),
  date_create: z.string().datetime(), // ISO 8601 string
  date_update: z.string().datetime(), // ISO 8601 string
});

// Schema para "discipulos"
const discipuloSchema = z.object({
  user_discipulos: idAndFirstNameSchema,
});

// Schema para "membro"
export const membroSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  presencas_cultos: z.array(presencaCultoSchema),
  discipulador: z.array(z.any()), // Array vazio no exemplo, deixei flexível
  discipulos: z.array(discipuloSchema),
  cargo_de_lideranca: idAndNameSchema,
  situacao_no_reino: idAndNameSchema,
  user: z.null().or(idAndFirstNameSchema), // Pode ser null ou um objeto com id e first_name
});

export type MembroCelula = z.infer<typeof membroSchema>;


// Schema principal
export const celulaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  membros: z.array(membroSchema),
  lider: idAndFirstNameSchema,
  supervisao: idAndNameSchema,
  cep: z.string(), // CEP como string (não validei formato específico)
  cidade: z.string(),
  estado: z.string().length(2), // Estado como UF (ex.: "MA")
  bairro: z.string(),
  endereco: z.string(),
  numero_casa: z.string(), // Pode ser ajustado para z.number() se for sempre numérico
  date_que_ocorre: z.string(), // Dia da semana como string (ex.: "2")
  date_inicio: z.string().datetime(), // ISO 8601 string
  date_multipicar: z.string().datetime(), // ISO 8601 string
});

// Tipo inferido do schema
export type Celula = z.infer<typeof celulaSchema>;


const ControlePresencaCelulaPropsSchema = z.object({
  id: z.string(),
  celula: celulaSchema,
  culto: z.string(),
})

export type ControlePresencaCelulaProps = z.infer<
  typeof ControlePresencaCelulaPropsSchema
>
