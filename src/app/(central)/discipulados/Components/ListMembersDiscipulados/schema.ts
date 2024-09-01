export interface Membro {
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
  }[];
  discipulos: {
    user_discipulos: {
      id: string;
      first_name: string;
    };
  }[];
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
