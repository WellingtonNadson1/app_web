import { z } from "zod";

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
  .array();

export type Meeting = z.infer<typeof MeetingSchema>;

const ReuniaoCelulaSchema = z.object({
  id: z.string(),
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_reuniao_celula: z.object({}).array(),
});

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
});

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
});

export type CelulaProps = z.infer<typeof CelulaSchema>;

const PresencaCultoCelulaSchema = z.object({
  id: z.string(),
  status: z.boolean(),
  membro: z.string(),
  presenca_culto: z.string(),
});

export type PresencaCultoProps = z.infer<typeof PresencaCultoCelulaSchema>;

const ControlePresencaCelulaPropsSchema = z.object({
  id: z.string(),
  celula: CelulaSchema,
  culto: z.string()
});

export type ControlePresencaCelulaProps = z.infer<typeof ControlePresencaCelulaPropsSchema>

const attendanceSchema = z.object({
  status: z.string(),
  membro: z.string(),
  presenca_culto: z.string(),
});

export type attendance = z.infer<typeof attendanceSchema>;

export type ReuniaoCelulaSuccessData = {
  status: string;
  celula: string;
  data_reuniao: string;
  presencas_membros_reuniao_celula: string;
  id?: string | undefined;
  visitantes: number;
  almas_ganhas: number;
};

export const reuniaoCelulaUpdateSchema = z.object({
  id: z.string().optional(),
  visitantes: z.number().int().positive(),
  almas_ganhas: z.number().int().positive(),
});

export type reuniaoCelulaUpdate = z.infer<typeof reuniaoCelulaUpdateSchema>;

export const reuniaoCelulaUpdateSchemaReturn = z.object({
  id: z.string().optional(),
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: z.string(),
  visitantes: z.number().int().positive(),
  almas_ganhas: z.number().int().positive(),
});

export type reuniaoCelulaUpdateReturn = z.infer<
  typeof reuniaoCelulaUpdateSchemaReturn
>;

const reuniaoCelulaDataSchema = z.object({
  id: z.string().optional(),
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: z.string(),
  visitantes: z.number().int().positive(),
  almas_ganhas: z.number().int().positive(),
});

export type reuniaoCelulaData = z.infer<typeof reuniaoCelulaDataSchema>;

const reuniaoCelulaDataSchema2 = z.object({
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: z.string().nullable(),
});

export type reuniaoCelulaData2 = z.infer<typeof reuniaoCelulaDataSchema2>;

const attendanceReuniaCelulaSchema = z.object({
  status: z.string(),
  membro: z.string(),
  which_reuniao_celula: z.string(),
});

export type attendanceReuniaoCelula = z.infer<
  typeof attendanceReuniaCelulaSchema
>;
