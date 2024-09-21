import { z } from "zod";

export interface PropsForm {
  membro: MembroSupervisor;
}

export type dataSchemaReturnCreateDiscipulado = {
  discipulado_id: string;
  usuario_id: string;
  discipulador_id: string;
  data_ocorreu: string;
};

export type dataSchemaReturnExistDiscipuladoAllCell = {
  data: {
    id: string;
    first_name: string;
    cargo_de_lideranca: {
      id: string;
      nome: string;
    };
    discipulador: {
      user_discipulador: {
        id: string;
        first_name: string;
      };
      _count: {
        discipulado: number;
      };
      discipulado: {
        data_ocorreu: string;
      }[];
    }[];
    discipulos: {
      user_discipulos: {
        id: string;
        first_name: string;
      };
      _count: {
        discipulado: number;
      };
      discipulado: {
        data_ocorreu: string;
      }[];
    }[];
  }[];
};

export type dataSchemaReturnExistDiscipulado = {
  data: {
    quantidadeDiscipuladoRealizado: number;
    discipuladosRealizados: {
      discipulado_id: string;
      data_ocorreu: string;
    }[];
  };
};

export type dataSchemaGetDiscipuladoAllSupervisor = {
  supervisor_id: string;
  data_ocorreu: Date;
};

export const dataSchemaCreateDiscipulado = z.object({
  usuario_id: z.string(),
  discipulador_id: z.string(),
  data_ocorreu: z.date()
})

export type dataCreateDiscipulado = z.infer<typeof dataSchemaCreateDiscipulado>

export interface MembroSupervisor {
  id: string;
  first_name: string;
  cargo_de_lideranca: {
    id: string;
    nome: string;
  };
  // Discipulador
  discipulador: {
    user_discipulador: {
      id: string;
      first_name: string;
    };
    _count: {
      discipulado: number;
    };
    discipulado: {
      data_ocorreu: string;
    }[];
    // Discipulos
    discipulos: {
      user_discipulos: {
        id: string;
        first_name: string;
      };
      _count: {
        discipulado: number;
      };
      discipulado: {
        data_ocorreu: string;
      }[];
    }[];
  }[];
}

export interface DiscipuloOfSupervisor {
  user_discipulos: {
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
    discipulador: {
      user_discipulador: {
        id: string;
        first_name: string;
      };
    }[];
    // Discipulos
    discipulos: {
      user_discipulos: {
        id: string;
        first_name: string;
      };
    }[];
    user_roles: {
      rolenew: {
        name: string;
      };
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
  };
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
