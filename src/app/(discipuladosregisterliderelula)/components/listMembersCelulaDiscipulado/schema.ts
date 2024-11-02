import { z } from 'zod'

export interface PropsForm {
  membro: MembroCell
}

export type dataSchemaReturnCreateDiscipulado = {
  discipulado_id: string
  usuario_id: string
  discipulador_id: string
  data_ocorreu: Date
}

export type dataSchemaReturnExistDiscipuladoAllCell = {
  data: {
    membros: {
      id: string
      first_name: string
      cargo_de_lideranca: {
        id: string
        nome: string
      }
      discipulador: {
        user_discipulador: {
          id: string
          first_name: string
        }
        _count: {
          discipulado: number
        }
        discipulado: {
          data_ocorreu: Date
        }[]
      }[]
    }[]
  }[]
}

export type dataSchemaReturnExistDiscipulado = {
  data: {
    quantidadeDiscipuladoRealizado: number
    discipuladosRealizados: {
      discipulado_id: string
      data_ocorreu: Date
    }[]
  }
}

export type dataSchemaGetDiscipuladoAllCell = {
  cell_id: string
  data_ocorreu: Date
}

export const dataSchemaCreateDiscipulado = z.object({
  usuario_id: z.string(),
  discipulador_id: z.string(),
  data_ocorreu: z.preprocess(
    (arg) => {
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
    },
    z.date({
      required_error: 'Data do discipulado é obrigatória.',
    }),
  ),
})

export type dataCreateDiscipulado = z.infer<typeof dataSchemaCreateDiscipulado>

export interface MembroCell {
  id: string
  first_name: string
  cargo_de_lideranca: {
    id: string
    nome: string
  }
  discipulador: {
    user_discipulador: {
      id: string
      first_name: string
    }
    _count: {
      discipulado: number
    }
    discipulado: {
      data_ocorreu: Date
    }[]
  }[]
}

export interface Membro {
  id: string
  first_name: string
  cargo_de_lideranca: {
    id: string
    nome: string
  }
  // Discipulador
  discipulador: {
    user_discipulador: {
      id: string
      first_name: string
    }
  }[]
  // Discipulos
  discipulos: {
    user_discipulos: {
      id: string
      first_name: string
    }
  }[]
  user: {
    id: string
    first_name: string
  }
  situacao_no_reino: {
    id: string
    nome: string
  }
}

export interface CelulaData {
  id: string
  nome: string
  membros: Membro[]
  lider: {
    id: string
    first_name: string
  }
  supervisao: {
    id: string
    nome: string
  }
  date_que_ocorre: boolean
}

export interface ListMembersCelulaProps {
  data: CelulaData
}
