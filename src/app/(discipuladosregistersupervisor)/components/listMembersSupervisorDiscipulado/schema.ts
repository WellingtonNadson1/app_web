export interface PropsForm {
  membro: MembroSupervisor
}

export type dataSchemaReturnCreateDiscipulado = {
  discipulado_id: string
  usuario_id: string
  discipulador_id: string
  data_ocorreu: string
}

export type dataSchemaReturnExistDiscipuladoAllCell = {
  data: {
    id: string
    first_name: string
    cargo_de_lideranca: {
      id: string
      nome: string
    }
    discipulador_usuario_discipulador_usuario_usuario_idTouser: {
      user_discipulador_usuario_discipulador_idTouser: {
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
    discipulador_usuario_discipulador_usuario_discipulador_idTouser: {
      user_discipulador_usuario_usuario_idTouser: {
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

export type dataSchemaGetDiscipuladoAllSupervisor = {
  supervisor_id: string
  data_ocorreu: Date
}

export type dataSchemaCreateDiscipulado = {
  usuario_id: string,
  discipulador_id: string
  data_ocorreu: Date
}

export interface MembroSupervisor {
  id: string
  first_name: string
  cargo_de_lideranca: {
    id: string
    nome: string
  }
  // Discipulador
  discipulador_usuario_discipulador_usuario_usuario_idTouser: {
    user_discipulador_usuario_discipulador_idTouser: {
      id: string
      first_name: string
    }
    _count: {
      discipulado: number
    }
    discipulado: {
      data_ocorreu: string
    }[]
    // Discipulos
    discipulador_usuario_discipulador_usuario_discipulador_idTouser: {
      user_discipulador_usuario_usuario_idTouser: {
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
}

export interface DiscipuloOfSupervisor {
  user_discipulador_usuario_usuario_idTouser: {
    id: string;
    first_name: string;
  };
  _count: {
    discipulado: number;
  };
  discipulado: {
    data_ocorreu: string;
  }[];
}

export interface Supervisor {
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    image_url: string;
    role: string;
    // Discipulador
    discipulador_usuario_discipulador_usuario_usuario_idTouser: {
      user_discipulador_usuario_discipulador_idTouser: {
        id: string,
        first_name: string
      },
    }[],
    // Discipulos
    discipulador_usuario_discipulador_usuario_discipulador_idTouser: {
      user_discipulador_usuario_usuario_idTouser: {
        id: string,
        first_name: string
      },
    }[],
    user_roles: {
      rolenew: {
        name: string
      }
    }[];
    supervisao_pertence: {
      id: string;
      nome: string;
    };
    situacao_no_reino: {
      id: string;
      nome: string;
    };
    cargo_de_lideranca: {
      id: string;
      nome: string;
    };
  }
}

export interface CelulaData {
  id: string;
  nome: string;
  // membros: Membro[];
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
