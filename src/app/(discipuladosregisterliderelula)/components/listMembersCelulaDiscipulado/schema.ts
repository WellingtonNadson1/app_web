export interface PropsForm {
  membro: MembroCell
}

export type dataSchemaReturnCreateDiscipulado = {
  discipulado_id: string
  usuario_id: string
  discipulador_id: string
  data_ocorreu: string
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
          data_ocorreu: string
        }[]
      }[]
    }[]
  }[]
}

export type dataSchemaReturnExistDiscipulado = {
  data: {
    quantidadeDiscipuladoRealizado: number,
    discipuladosRealizados: {
      discipulado_id: string
      data_ocorreu: string
    }[]
  }
}

export type dataSchemaGetDiscipuladoAllCell = {
  cell_id: string
  data_ocorreu: Date
}

export type dataSchemaCreateDiscipulado = {
  usuario_id: string,
  discipulador_id: string
  data_ocorreu: Date
}

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
      data_ocorreu: string
    }[]
  }[]
}

export interface Membro {
  id: string;
  first_name: string;
  cargo_de_lideranca: {
    id: string;
    nome: string;
  };
  // Discipulador
  discipulador: {
    user_discipulador: {
      id: string,
      first_name: string
    },
  }[],
  // Discipulos
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

export interface CelulaData {
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
  data: CelulaData;
}
