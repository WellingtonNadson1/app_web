import { z } from 'zod';

const Membro = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

const PresencasMembrisReuniaoCelula = z.array(
  z.object({
    status: z.boolean(),
    membro: Membro,
  }),
);

const ReunioesCelula = z.array(
  z.object({
    id: z.string(),
    data_reuniao: z.string(),
    visitantes: z.string(),
    almas_ganhas: z.string(),
    presencas_membros_reuniao_celula: PresencasMembrisReuniaoCelula,
  }),
);

export const CelulaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  lider: z.object({ first_name: z.string() }),
  membros: z
    .object({
      id: z.string(),
      first_name: z.string(),
    })
    .array(),
  _count: z.object({
    membros: z.number(),
  }),
  reunioes_celula: ReunioesCelula,
});

const Supervisor = z.object({
  first_name: z.string(),
});

export const SupervisionDataSchema = z.object({
  supervisionData: z.object({
    nome: z.string(),
    supervisor: Supervisor,
    celulas: CelulaSchema.array(),
  }),
});

export type TSupervisionData = z.infer<typeof SupervisionDataSchema>;
export type TCelula = z.infer<typeof CelulaSchema>;

export const FormRelatorioDataSchema = z.object({
  superVisionId: z.string(),
  startDate: z.date({
    required_error: 'Você precisar colocar uma data inicial.',
  }),
  endDate: z.date({
    required_error: 'Você precisar colocar uma data final.',
  }),
});

export type FormRelatorioSchema = z.infer<typeof FormRelatorioDataSchema>;

export const SupervisoesSchema = z.object({
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
});

export type TSupervisoes = z.infer<typeof SupervisoesSchema>;
