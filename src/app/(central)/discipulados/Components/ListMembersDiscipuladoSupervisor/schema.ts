import { z } from "zod";

export interface Membro {
  id: string;
  first_name: string;
  cargo_de_lideranca: {
    id: string;
    nome: string;
  };
  discipulador: {
    user_discipulador: {
      id: string,
      first_name: string
    },
  }[],
  discipulos: {
    user_discipulos: {
      id: string,
      first_name: string
    },
  }[],
  user: {
    id: string;
    first_name: string;
  };
  situacao_no_reino: {
    id: string;
    nome: string;
  };
}

export interface CelulaDataDiscipulado {
  id: string;
  nome: string;
  membros: Membro[];
  lider: {
    id: string;
    first_name: string;
  };
  supervisao: {
    id: string;
    nome: string;
  };
  date_que_ocorre: boolean;
}

export interface ListMembersCelulaProps {
  data: CelulaDataDiscipulado;
}

const CelulaSchema = z
  .object({
    id: z.string(),
    nome: z.string(),
    lider: z.object({
      id: z.string(),
      first_name: z.string(),
    }),
  })

export type Celula = z.infer<typeof CelulaSchema>

const SupervisaoDataSchema = z
  .object({
    supervisor: z.object({
      id: z.string(),
      first_name: z.string(),
      discipulos: z.object({
        user_discipulos: z.object({
          id: z.string(),
          first_name: z.string(),
        }),
      }).array(),
    }),
  })

export type SupervisaoData = z.infer<typeof SupervisaoDataSchema>
