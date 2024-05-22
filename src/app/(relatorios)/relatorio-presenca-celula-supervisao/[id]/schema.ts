import { array, z } from 'zod'

const Membro = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
})

const PresencasMembrisReuniaoCelula = z.array(z.object({
  status: z.boolean(),
  membro: Membro
}))

const ReunioesCelula = z.array(z.object({
  id: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: PresencasMembrisReuniaoCelula
}))

export const CelulaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  lider: z.object({ first_name: z.string() }),
  membros: z.object({
    id: z.string(),
    first_name: z.string(),
  }).array(),
  _count: z.object({
    membros: z.number()
  }),
  reunioes_celula: ReunioesCelula
})

const Supervisor = z.object({
  first_name: z.string(),
})

export const SupervisionDataSchema = z.object({
  supervisionData: z.object({
    nome: z.string(),
    supervisor: Supervisor,
    celulas: CelulaSchema.array()
  })
})

export type TSupervisionData = z.infer<typeof SupervisionDataSchema>;
export type TCelula = z.infer<typeof CelulaSchema>;

export const FormRelatorioDataSchema = z.object({
  superVisionId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
})

export type FormRelatorioSchema = z.infer<typeof FormRelatorioDataSchema>;
