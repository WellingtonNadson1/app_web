export type dataUpdateDiscipulador = {
  id: string,
  discipuladorId: string
}

export interface Membro {
  id: string;
  first_name: string;
  cargo_de_lideranca: {
    id: string;
    nome: string;
  };
  discipulador_usuario_discipulador_usuario_usuario_idTouser: {
    user_discipulador_usuario_discipulador_idTouser: {
      id: string,
      first_name: string
    },
  }[],
  discipulador_usuario_discipulador_usuario_discipulador_idTouser: {
    user_discipulador_usuario_usuario_idTouser: {
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
