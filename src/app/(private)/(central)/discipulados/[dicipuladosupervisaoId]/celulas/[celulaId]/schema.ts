export type dataUpdateDiscipulador = {
  id: string
  discipuladorId: string
}

export interface Membro {
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
  }[]
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
