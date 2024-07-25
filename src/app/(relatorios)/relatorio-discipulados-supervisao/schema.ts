import { z } from 'zod'

const UserDiscipuladorUsuarioDiscipuladorIdTouser = z.object({
  first_name: z.string()
})

const DiscipuladorUsuario = z.object({
  user_discipulador: UserDiscipuladorUsuarioDiscipuladorIdTouser
})

const Discipulado = z.object({
  discipulador_usuario: DiscipuladorUsuario,
  data_ocorreu: z.string()
})

const DiscipuladorUsuarioDiscipuladorUsuarioUsuarioIdTouser = z.object({
  user_discipulador: z.object({
    first_name: z.string()
  }),
  discipulado: Discipulado.array()
})

const MembroDiscipuladoSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  celula: z.object({
    id: z.string(),
    nome: z.string(),
    lider: z.object({
      first_name: z.string()
    })
  }),
  supervisao_pertence: z.object({
    id: z.string(),
    nome: z.string()
  }),
  discipulador: DiscipuladorUsuarioDiscipuladorUsuarioUsuarioIdTouser.array()
})

const MembrosDiscipuladoSchema = z.object({
  membros: MembroDiscipuladoSchema.array()
})

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
  cultos: z.object({
    totalCultosPrimicias: z.number(),
    totalCultosQuarta: z.number(),
    totalCultosSabado: z.number(),
    totalCultosDomingoManha: z.number(),
    totalCultosDomingoTarde: z.number(),
    totalCultosPeriodo: z.number(),
  }),
})

export const FormRelatorioDataSchema = z.object({
  superVisionId: z.string(),
  startDate: z.date({
    required_error: "Você precisar colocar uma data inicial.",
  }),
  endDate: z.date({
    required_error: "Você precisar colocar uma data final.",
  }),
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

export interface CultoSemana {
  id: string
}

export interface PresencaCulto {
  data_inicio_culto: string
  culto_semana: CultoSemana
}

export interface Relatorio {
  status: boolean
  cultoIndividualId: string
  date_create: string
  presenca_culto: PresencaCulto
}

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
      culto_semana: {
        id: string
      }
    }
  }[];
  cargo_de_lideranca: {
    nome: string;
  };
  presencasFiltradas: {
    status: boolean;
    cultoIndividualId: string;
    date_create: string;
    presenca_culto: {
      data_inicio_culto: string;
      culto_semana: {
        id: string;
      };
    };
  }[],
  cultos: {
    porcentagemPresencaDomingoSacrificio: number,
    porcentagemPresencaPrimicia: number,
    porcentagemPresencaQuarta: number,
    porcentagemPresencaSabado: number,
    porcentagemPresencaTotal: number;
    porcentagemPresencaTotalDomingoManha: number,
    porcentagemPresencaTotalDomingoTarde: number,
  };
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

export type MemberDataDiscipulado = z.infer<typeof MembroDiscipuladoSchema>
export type MembersDataDiscipulado = z.infer<typeof MembrosDiscipuladoSchema>
export type MemberData = z.infer<typeof MemberDataSchema>
export type GroupedData = Record<string, MemberData[]>;
export type PresencaForDate = z.infer<typeof PresencaForDateSchema>;
export type FormRelatorioSchema = z.infer<typeof FormRelatorioDataSchema>;
export type GroupedForCulto = Record<string, PresencaForDate[]>;
