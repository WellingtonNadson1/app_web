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
    date_create: z.string(),
    membro: MembroSchema
})

export const PresencaForDateSchema = z.object({
    id: z.string(),
    data_inicio_culto: z.string(),
    presencas_culto: PresencaCultoSchema.array(),
    culto_semana: z.object({
        nome: z.string()
    }),
    totalCultosPeriodo: z.number()
})

export const FormRelatorioDataSchema = z.object({
  superVisionId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
})


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
    id: z.string(),
    nome: z.string()
  })
})

export interface Pessoa {
  id: string;
  first_name: string;
  last_name: string;
  presencas_cultos: {
    status: boolean;
    cultoIndividualId: string;
    date_create: string;
    presenca_culto: {
      data_inicio_culto: string;
    }
  }[];
  celula: {
    id: string;
    nome: string;
    lider: {
      id: string;
      first_name: string;
    }
  };
  quantidadeCultos: number;
  porcentagemPresenca: number;
}

export interface ISupervisoes {
  id: string;
  nome: string;
  membros: {
      id: string;
      first_name: string;
  }[];
  cor: string;
  celulas: {
      id: string;
      nome: string;
  }[];
  supervisor: {
      id: string;
      first_name: string;
  } | null;
}

export interface CelulaProps {
  celula: string;
  membros: Pessoa[];
}

export interface MembroPresencaProps {
  membro: Pessoa;
}



export type MemberData = z.infer<typeof MemberDataSchema>
export type GroupedData = Record<string, MemberData[]>;
export type PresencaForDate = z.infer<typeof PresencaForDateSchema>;
export type FormRelatorioSchema = z.infer<typeof FormRelatorioDataSchema>;
export type GroupedForCulto = Record<string, PresencaForDate[]>;
